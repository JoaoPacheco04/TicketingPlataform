using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using TicketingPlataform.Data;
using TicketingPlataform.Services;
using Hangfire;
using TicketingPlataform.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<TicketingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfire(config => config
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddHangfireServer();

builder.Services.AddScoped<ReservationExpirationService>();

builder.Services.AddSignalR();

builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("Redis")!));

var app = builder.Build();

app.UseHangfireDashboard("/hangfire");

RecurringJob.AddOrUpdate<ReservationExpirationService>(
    "expire-overdue-reservations",
    service => service.ExpireOverdueReservationsAsync(),
    "* * * * *");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();
app.MapHub<SeatReservationHub>("/hubs/seat-reservation");

app.Run();