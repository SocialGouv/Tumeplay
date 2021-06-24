const OrdersAPI = {
  orderBoxes: async order => {
    const res = await fetch(process.env.REACT_APP_API_URL + '/commandes', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: order.first_name,
        last_name: order.last_name,
        email: order.email,
        phone: order.phone,
        delivery: order.delivery,
        address: order.address,
        address_region: order.address_region,
        address_deptcode: order.address_deptcode,
        address_dept: order.address_dept,
        content: order.content,
        address_zipcode: order.address_zipcode,
        poi_name: order.poi_name
      }),
    });
    return res.ok;
  },
};

export default OrdersAPI;
