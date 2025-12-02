using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Define the /suppliers endpoint
app.MapGet("/suppliers", () => 
{
    // TODO: Implement the suppliers endpoint
    return Results.Ok(new List<string> { "Supplier 1", "Supplier 2" });
});

// Define the /documents endpoint
app.MapGet("/documents", () => 
{
    // TODO: Implement the documents endpoint
    return Results.Ok(new List<string> { "Document 1", "Document 2" });
});

app.Run();