using Huong.Debugging;

namespace Huong;

public class HuongConsts
{
    public const string LocalizationSourceName = "Huong";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = true;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "99e3788084e14eefbbb6b3dea8ccc7a8";
}
