import apiKeys from "constants/apiKeys";

async function getData(apiKey : string) {
  const req = await fetch(apiKey);
  return await req.json();
}

export default getData ;
