export const formFullUrl = (relativePath) => {
  const endpoint = process.env.VUE_APP_IMAGEKIT_URL_ENDPOINT
  return endpoint + relativePath
}
export const CARD_PLACEHOLDER_RELATIVE_URL = '/tr:n-card/Placeholder/plain.png'
export const CARD_PLACEHOLDER_FULL_URL = formFullUrl(CARD_PLACEHOLDER_RELATIVE_URL)
export const CARD_PLACEHOLDER_ORIGINAL_RELATIVE_URL = '/Placeholder/plain.png'
export const BANNER_PLACEHOLDER_RELATIVE_URL = '/Banner/order.jpeg'
