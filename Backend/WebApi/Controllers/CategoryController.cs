using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.DTO;
using WebApi.Models;
using WebApi.Services;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public CategoryController(ApplicationDbContext context)
    {
        _context = context;
    }
    [HttpPost]
    public async Task<IActionResult> CreateCategory(CreateCategoryDtoRequest categoryDto)
    {
        var category = new Category
        {
            Name = categoryDto.Name,
            Id = Guid.NewGuid()
        };
        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();
        return Ok(category);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        return Ok(await _context.Categories.ToListAsync());
    }

    [HttpPut]
    public async Task<IActionResult> UpdateCategory(Category category)
    {
        var oldCategory = await _context.Categories.FindAsync(category.Id);
        if(oldCategory is null) return NotFound("Category not found");
        
        oldCategory.Name = category.Name;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var category = await _context.Categories.FindAsync(id);
        if(category is null) return NotFound("Category not found");
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}