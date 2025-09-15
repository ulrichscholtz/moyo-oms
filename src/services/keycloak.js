import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://moyo-oms-auth.agreeablerock-3315e1ad.southafricanorth.azurecontainerapps.io",
  realm: "moyo-realm",
  clientId: "moyo-vendor-ui",
});

export default keycloak;
