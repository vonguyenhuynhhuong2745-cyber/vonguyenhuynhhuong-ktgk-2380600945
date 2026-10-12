using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace Huong.EntityFrameworkCore;

public static class HuongDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<HuongDbContext> builder, string connectionString)
    {
        builder.UseSqlServer(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<HuongDbContext> builder, DbConnection connection)
    {
        builder.UseSqlServer(connection);
    }
}
