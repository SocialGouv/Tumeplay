import {REACT_APP_URL} from '@env';

const OrdersAPI = {
  orderBoxes: async order => {
    const res = await fetch(REACT_APP_URL + '/commandes', {
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
        address_more: order.address_more,
        address_region: order.address_region,
        address_deptcode: order.address_deptcode,
        address_dept: order.address_dept,
        content: order.content,
        address_zipcode: order.address_zipcode,
        address_city: order.address_city,
        poi_name: order.poi_name,
        poi_number: order.poi_number,
        referent: order.referent,
        utilisateurs_mobile: order.utilisateurs_mobile,
        version: 3,
      }),
    });
    return res;
  },
};

export default OrdersAPI;
