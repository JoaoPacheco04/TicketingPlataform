using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketingPlataform.Migrations
{
    /// <inheritdoc />
    public partial class AddQrCodeToReservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CheckedIn",
                table: "Reservations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "QrCode",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckedIn",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "QrCode",
                table: "Reservations");
        }
    }
}
