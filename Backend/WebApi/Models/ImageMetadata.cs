using System.ComponentModel.DataAnnotations;

namespace WebApi.Models;

public class ImageMetadata
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string BucketName { get; set; } = string.Empty;
    public string ObjectName { get; set; } = string.Empty; // Уникальное имя в MinIO
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}