export function getEndpointsURL() {
    return location.href.replace(/\/client.*/, "/server/endpoints.php")
}
