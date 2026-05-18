async function testProxy() {
  const testUrl = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
  const proxyUrl = `http://localhost:3000/api/proxy?url=${encodeURIComponent(testUrl)}`;
  
  console.log(`Testing proxy with: ${proxyUrl}`);
  try {
    const res = await fetch(proxyUrl);
    console.log(`Status: ${res.status}`);
    console.log(`Content-Type: ${res.headers.get("content-type")}`);
  } catch (e) {
    console.error(`Proxy test failed: ${e.message}`);
    console.log("This is expected if the server hasn't been rebuilt with the new /api/proxy route.");
  }
}

testProxy();
