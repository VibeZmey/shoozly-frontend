using Minio;
using Minio.DataModel.Args;

namespace WebApi.Services;

public class MinioService
    {
        private readonly IMinioClient _minioClient;
        private readonly string _bucketName;

        public MinioService(IConfiguration configuration)
        {
            var endpoint = configuration["MinIO:Endpoint"];
            var accessKey = configuration["MinIO:AccessKey"];
            var secretKey = configuration["MinIO:SecretKey"];
            _bucketName = configuration["MinIO:BucketName"] ?? "images";

            _minioClient = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey)
                .Build();
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
        {
            var bucketExists = await _minioClient.BucketExistsAsync(
                new BucketExistsArgs(). WithBucket(_bucketName));
            
            if (!bucketExists)
            {
                await _minioClient.MakeBucketAsync(
                    new MakeBucketArgs().WithBucket(_bucketName));
            }

            var objectName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";

            await _minioClient.PutObjectAsync(new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(objectName)
                .WithStreamData(fileStream)
                . WithObjectSize(fileStream.Length)
                .WithContentType(contentType));

            return objectName;
        }

        // ✅ НОВЫЙ МЕТОД: Получить stream файла
        public async Task<Stream> GetFileStreamAsync(string objectName)
        {
            var memoryStream = new MemoryStream();

            await _minioClient.GetObjectAsync(new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(objectName)
                .WithCallbackStream((stream) =>
                {
                    stream.CopyTo(memoryStream);
                }));

            memoryStream.Position = 0;
            return memoryStream;
        }

        public async Task DeleteFileAsync(string objectName)
        {
            await _minioClient.RemoveObjectAsync(new RemoveObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(objectName));
        }
    }
