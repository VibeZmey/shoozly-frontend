using System.Text.Json.Serialization;

namespace WebApi.Models;

public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double Price { get; set; }
    public Guid CategoryId { get; set; }
    
    [JsonIgnore]
    public Category Category { get; set; }  // ← ДОБАВЬТЕ ЭТО! 
    public string? ImageUrl { get; set; }
}