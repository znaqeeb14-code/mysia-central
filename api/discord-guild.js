export default async function handler(req, res) {
  const INVITE_CODE = "QuXZDgRWd2";

  try {
    const response = await fetch(
      `https://discord.com/api/v10/invites/${INVITE_CODE}?with_counts=true`,
      {
        headers: {
          "User-Agent": "MYSIA-Central/1.0"
        },
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(`Discord API returned ${response.status}`);
    }

    const data = await response.json();

    const memberCount = data.approximate_member_count;

    if (typeof memberCount !== "number") {
      throw new Error("Discord member count unavailable");
    }

    res.setHeader("Cache-Control", "no-store");

    res.status(200).json({
      success: true,
      memberCount,
      serverName: data.guild?.name ?? "MYSIA Discord",
      source: "Discord Invite API"
    });

  } catch (error) {
    console.error("Discord API error:", error);

    res.status(500).json({
      success: false,
      error: "Unable to retrieve Discord member count"
    });
  }
}
