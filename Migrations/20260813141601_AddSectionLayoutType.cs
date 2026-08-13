using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketingPlataform.Migrations
{
    /// <inheritdoc />
    public partial class AddSectionLayoutType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LayoutType",
                table: "Sections",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LayoutType",
                table: "Sections");
        }
    }
}
