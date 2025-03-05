export function getFormattedTimeZones(locale = "en") {
    const timeZones = Intl.supportedValuesOf("timeZone");
    const displayNames = new Intl.DisplayNames([locale], { type: "region" });

    return timeZones.reduce((finalValues: any[], tz) => {
        try {
            const dateTimeFormat = new Intl.DateTimeFormat(locale, {
                timeZone: tz,
                timeZoneName: "longOffset",
            });

            const parts = dateTimeFormat.formatToParts(new Date());
            const offsetPart = parts.find((part) => part.type === "timeZoneName")?.value || "";

            // Extract last part of timezone for better display
            const regionParts = tz.split("/");
            const regionCode = regionParts[regionParts.length - 1].replace(/_/g, " "); // Convert "New_York" to "New York"

            let displayLabel;
            try {
                displayLabel = displayNames.of(regionCode) || regionCode;
            } catch {
                displayLabel = regionCode; // Fallback if displayNames.of() fails
            }

            finalValues.push({
                timezoneName: tz,
                displayLabel,
                tooltip: offsetPart,
            });
        } catch (error) {
            console.error(`Error processing timezone ${tz}:`, error);
        }
        return finalValues;
    }, []);
}