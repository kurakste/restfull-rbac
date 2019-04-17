import Amazon from '../model/amazon';

const controller = {
  
  get_amazon_items: (req: any, res: any, next: Function):void => {
    Amazon.find({})
    .exec()
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
  
  },
  
}

export default controller;