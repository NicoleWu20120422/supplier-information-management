using Microsoft.EntityFrameworkCore;
using SupplierInformationManagement.Api.Data;
using SupplierInformationManagement.Api.Services;

// Create builder
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<SimDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SIMConnection"))
);

builder.Services.AddScoped<SupplierService>();
builder.Services.AddScoped<DocumentService>();
builder.Services.AddScoped<WorkflowService>();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();
