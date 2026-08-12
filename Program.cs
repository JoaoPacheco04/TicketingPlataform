using Microsoft.EntityFrameworkCore;
using TicketingPlataform.Data;
using TicketingPlataform.Services;
using Hangfire;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<TicketingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfire(config => config
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddHangfireServer();

builder.Services.AddScoped<ReservationExpirationService>();

var app = builder.Build();

app.UseHangfireDashboard("/hangfire");

RecurringJob.AddOrUpdate<ReservationExpirationService>(
    "expire-overdue-reservations",
    service => service.ExpireOverdueReservationsAsync(),
    "* * * * *");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
