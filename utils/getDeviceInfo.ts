export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;

  // Detect browser
  let browser = "Unknown Browser";
  if (userAgent.includes("Firefox")) browser = "Mozilla Firefox";
  else if (userAgent.includes("Chrome")) browser = "Google Chrome";
  else if (userAgent.includes("Safari")) browser = "Apple Safari";
  else if (userAgent.includes("Edge")) browser = "Microsoft Edge";
  else if (userAgent.includes("Opera")) browser = "Opera";
  else if (userAgent.includes("MSIE") || userAgent.includes("Trident"))
    browser = "Internet Explorer";

  // Detect OS
  let os = "Unknown OS";
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Macintosh")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
    os = "iOS";

  // Detect device type
  const isMobile = /Mobi|Android|iPhone/i.test(userAgent);
  const deviceType = isMobile ? "Mobile" : "Desktop";

  return {
    browser,
    os,
    deviceType,
    userAgent,
  };
};