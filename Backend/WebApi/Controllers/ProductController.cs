using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Models;
using WebApi.Services;
using WebApi.DTO;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly MinioService _minioService;

    public ProductController(ApplicationDbContext context, MinioService minioService)
    {
        _context = context;
        _minioService = minioService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct(CreateProductDtoRequest productDtoRequest)
    {
        var file = productDtoRequest.Image;
        var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = productDtoRequest.Name,
            CategoryId = productDtoRequest.CategoryId,
            Price = productDtoRequest.Price
        };
        
        if (file is null || file.Length == 0 || !allowedTypes.Contains(file.ContentType))
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return Ok(product);
        }
        
        using var stream = file.OpenReadStream();
        var objectName = await _minioService.UploadFileAsync(
            stream, file.FileName, file.ContentType);

        var imageMetadata = new ImageMetadata
        {
            FileName = file.FileName,
            BucketName = "images",
            ObjectName = objectName,
            ContentType = file.ContentType,
            FileSize = file.Length
        };
        _context.Images.Add(imageMetadata);
        await _context.SaveChangesAsync();
        
        product.ImageUrl = Url.Action("GetImageFile", new { id = imageMetadata.Id });
        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();
        
        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        Console.WriteLine($"PPPPPPPPPPPPPPPPPPPPPP {product.Id}");
        if(product is null) return NotFound("Product not found");
        
        if (product.ImageUrl is not null)
        {
            try
            {
                var imageId = int.Parse(product.ImageUrl.Split('/')[3]);
                var image = await _context.Images.FindAsync(imageId);
                if (image is null) return NotFound();
            
                await _minioService.DeleteFileAsync(image.ObjectName);
                _context.Images.Remove(image);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting file: {ex.Message}");
            }
        }
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    
    [HttpGet("{id}/file")]
    public async Task<IActionResult> GetImageFile(int id)
    {
        var image = await _context.Images.FindAsync(id);
        if (image is null)
            return NotFound();

        try
        {
            var stream = await _minioService.GetFileStreamAsync(image.ObjectName);
            return File(stream, image.ContentType, image.FileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving file: {ex.Message}");
        }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProduct(UpdateProductDtoRequest product)
    {
        var oldProduct = await _context.Products.FindAsync(product.Id);
        if(oldProduct == null) return NotFound("Product not found");

        if (product.Image is not null)
        {
            try
            {
                if (oldProduct.ImageUrl is not null)
                {
                    var imageId = int.Parse(oldProduct.ImageUrl.Split('/')[3]);
                    var image = await _context.Images.FindAsync(imageId);
                    if (image is null) return NotFound();

                    await _minioService.DeleteFileAsync(image.ObjectName);
                    _context.Images.Remove(image);
                    await _context.SaveChangesAsync();
                }

                var file = product.Image;
                using var stream = file.OpenReadStream();
                var objectName = await _minioService.UploadFileAsync(
                    stream, file.FileName, file.ContentType);

                var imageMetadata = new ImageMetadata
                {
                    FileName = file.FileName,
                    BucketName = "images",
                    ObjectName = objectName,
                    ContentType = file.ContentType,
                    FileSize = file.Length
                };
                _context.Images.Add(imageMetadata);
                await _context.SaveChangesAsync();

                oldProduct.ImageUrl = Url.Action("GetImageFile", new { id = imageMetadata.Id });
                oldProduct.Name = product.Name;
                oldProduct.CategoryId = product.CategoryId;
                oldProduct.Price = product.Price;

                await _context.SaveChangesAsync();
                return Ok(oldProduct);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating file: {ex.Message}");
            }
        }
        
        oldProduct.Name = product.Name;
        oldProduct.CategoryId = product.CategoryId;
        oldProduct.Price = product.Price;

        await _context.SaveChangesAsync();
        return Ok(oldProduct);
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(products);
    }
    
}
