import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const OrdersAPI = {
	getLogisticsOrders: (token, params) => {
    return axios.get(`${API_URL}/commandes`, {
      params: Object.assign({
        delivery: ['pickup', 'home'],
      }, params),
      headers: {
      Authorization: `Bearer ${token}`
    }});
  },
  getDeliveryOrders: (token, params) => {
    return axios.get(`${API_URL}/commandes`, {
			params: Object.assign({
				_limit: 1000
			}, params),
			headers: {
      Authorization: `Bearer ${token}`
    }});
  },
  countOrders: (token, params) => {
    return axios.get(`${API_URL}/commandes/count`,
      {
        params: Object.assign({
          delivery: ['pickup', 'home'],
        }, params),
        headers:
          {
            Authorization: `Bearer ${token}`
          }
      }
    );
  },
  printMondialRelayPDF: (token, ids) => {
    return axios.post(`${API_URL}/mondial-relay/merge-pdf`, {ids: ids}, {headers: {
      Authorization: `Bearer ${token}`
    }});
  },
  printColissimoPDF: (token, ids) => {
    return axios.post(`${API_URL}/colissimo/generate-pdf`, {ids: ids},
    {headers:
      {
        Authorization: `Bearer ${token}`
      }
    }
    );
  },
	update: (token, order) => {
		return axios.put(`${API_URL}/commandes/${order.id}`, order, {headers: {
      Authorization: `Bearer ${token}`
    }});
	},
  bulkUpdate: (token, orders) => {
    return axios.put(`${API_URL}/commandes/update/multiple`, {orders: orders}, {headers: {
      Authorization: `Bearer ${token}`
    }});
  },
	countThisWeekOrders: (token) => {
		var ourDate = new Date();
		const oneWeekAgo = ourDate.getDate() - 7;
		ourDate.setDate(oneWeekAgo);
    return axios.get(`${API_URL}/commandes/count`, {
			params: {
				created_at_gte: ourDate.getTime()
			},
			headers: {
   			Authorization: `Bearer ${token}`
    	}
		});
	},
	countLastWeekOrders: (token) => {
		var lastWeek = new Date();
		var lastLastWeek = new Date();
		const lw = lastWeek.getDate() - 7;
		const llw = lastLastWeek.getDate() - 14;
		lastWeek.setDate(lw);
		lastLastWeek.setDate(llw);
    return axios.get(`${API_URL}/commandes/count`, {
			params: {
				created_at_gte: lastLastWeek.getTime(),
				created_at_lte: lastWeek.getTime()
			},
			headers: {
   			Authorization: `Bearer ${token}`
    	}
		});
	},
	countPendingOrders: (token) => {
    return axios.get(`${API_URL}/commandes/count`, {
			params: {
				sent_ne: true
			},
			headers: {
   			Authorization: `Bearer ${token}`
    	}
		});
	},
	countTodayPendingOrders: (token) => {
		var ourDate = new Date();
		const oneWeekAgo = ourDate.getDate() - 1;
		ourDate.setDate(oneWeekAgo);
    return axios.get(`${API_URL}/commandes/count`, {
			params: {
				sent_ne: true,
				created_at_gte: ourDate.getTime()
			},
			headers: {
   			Authorization: `Bearer ${token}`
    	}
		});
	}
}

export default OrdersAPI;
