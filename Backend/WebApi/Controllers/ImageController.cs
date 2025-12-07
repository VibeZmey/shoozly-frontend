using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Models;
using WebApi.Services;


namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly MinioService _minioService;

        public ImagesController(ApplicationDbContext context, MinioService minioService)
        {
            _context = context;
            _minioService = minioService;
        }

        // POST: api/images/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is empty");

            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType))
                return BadRequest("Invalid file type");

            try
            {
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

                return Ok(new
                {
                    id = imageMetadata.Id,
                    fileName = imageMetadata.FileName,
                    // ✅ ВОЗВРАЩАЕМ URL К API, А НЕ К MinIO
                    url = Url.Action("GetImageFile", new { id = imageMetadata.Id }),
                    uploadedAt = imageMetadata. UploadedAt
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error uploading file: {ex.Message}");
            }
        }

        // ✅ НОВЫЙ ENDPOINT: Получить файл через API
        // GET: api/images/5/file
        [HttpGet("{id}/file")]
        public async Task<IActionResult> GetImageFile(int id)
        {
            var image = await _context.Images.FindAsync(id);
            if (image == null)
                return NotFound();

            try
            {
                var stream = await _minioService.GetFileStreamAsync(image.ObjectName);
                
                // Возвращаем файл напрямую
                return File(stream, image.ContentType, image.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving file: {ex.Message}");
            }
        }

        // GET: api/images
        [HttpGet]
        public async Task<IActionResult> GetAllImages()
        {
            var images = await _context.Images
                .OrderByDescending(i => i. UploadedAt)
                . ToListAsync();

            var imagesWithUrls = images.Select(image => new
            {
                id = image.Id,
                fileName = image.FileName,
                // ✅ URL ВЕДЁТ НА API, А НЕ НА MinIO
                url = Url.Action("GetImageFile", new { id = image.Id }),
                uploadedAt = image.UploadedAt
            }). ToList();

            return Ok(imagesWithUrls);
        }

        // GET: api/images/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetImage(int id)
        {
            var image = await _context. Images.FindAsync(id);
            if (image == null)
                return NotFound();

            return Ok(new
            {
                id = image.Id,
                fileName = image.FileName,
                // ✅ URL ВЕДЁТ НА API
                url = Url.Action("GetImageFile", new { id = image.Id }),
                uploadedAt = image.UploadedAt
            });
        }

        // DELETE: api/images/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            var image = await _context.Images.FindAsync(id);
            if (image == null)
                return NotFound();

            try
            {
                await _minioService.DeleteFileAsync(image.ObjectName);
                _context.Images.Remove(image);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting file: {ex.Message}");
            }
        }
    }
}