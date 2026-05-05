using DisasterAPI.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var connectionString = "Server=DESKTOP-5KSKK2V\\SQLEXPRESS;Database=DisasterResponseMIS;Integrated Security=True;Encrypt=Optional;TrustServerCertificate=True;";
builder.Services.AddSingleton(new DatabaseHelper(connectionString));

var app = builder.Build();

app.UseCors();
app.MapControllers();
app.Run("http://localhost:4000");