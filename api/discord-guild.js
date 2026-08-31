export default async function handler(req, res) {
  // MYSIA Discord Server
  const INVITE_CODE = "SdzS8rgRHF";

  try {
    const response = await fetch(
      `https://discord.com/api/v10/invites/${INVITE_CODE}?with_counts=true`,
      {
        method: "GET",
        headers: {
          "User-Agent": "MYSIA-Central/1.0",
          "Accept": "application/json"
        },
        cache: "no-store"
      }
    );

    // Discord API error
    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        `Discord API returned ${response.status}:`,
        errorText
      );

      return res.status(response.status).json({
        success: false,
        error: `Discord API returned ${response.status}`
      });
    }

    const data = await response.json();

    // Get approximate member count
    const memberCount = data.approximate_member_count;

    if (typeof memberCount !== "number") {
      console.error("Discord response:", data);

      return res.status(500).json({
        success: false,
        error: "Discord member count unavailable"
      });
    }

    // Prevent browser/CDN caching
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // Successful response
    return res.status(200).json({
      success: true,
      memberCount: memberCount,
      serverName: data.guild?.name || "MYSIA Discord",
      inviteCode: INVITE_CODE,
      inviteUrl: `https://discord.gg/${INVITE_CODE}`,
      source: "Discord Invite API"
    });

  } catch (error) {
    console.error("Discord API error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve Discord member count"
    });
  }
}
