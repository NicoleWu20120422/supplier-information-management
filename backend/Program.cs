using Microsoft.EntityFrameworkCore;
using SupplierInformationManagement.Api.Data;
using SupplierInformationManagement.Api.Services;
using System.Text.Json.Serialization;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
// Create builder
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
// Configure JSON serialization to use camelCase for property names (frontend expects camelCase)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<SimDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SIMConnection"))
);

builder.Services.AddScoped<SupplierService>();
builder.Services.AddScoped<DocumentService>();
builder.Services.AddScoped<WorkflowService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});
var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthorization();

app.MapControllers();

app.Run();
