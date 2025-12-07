namespace WebApi.DTO;

public class CreateProductDtoRequest
{
    public string Name { get; set; }
    public double Price { get; set; }
    public Guid CategoryId { get; set; }
    public IFormFile? Image { get; set; }
}

public class UpdateProductDtoRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double Price { get; set; }
    public Guid CategoryId { get; set; }
    public IFormFile? Image { get; set; }
}