interface AmazonProfile {
  id: string, 
  images: Array<string>,
  title: string, 
  about: string,
  description: string,
  price: string,
  availability: string,
  detail: string,
  asin: string,
  bsr: string,
  weight: number | 'NA';
}

export default AmazonProfile;