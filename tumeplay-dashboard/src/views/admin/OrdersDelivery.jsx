import React, {useState, useEffect, useContext} from 'react'
import Table from '../../components/Table'
import OrdersAPI from '../../services/api/orders'
import AppContext from '../../AppContext';
import { useHistory } from 'react-router'
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";
import Dropdown from "react-dropdown";
import ConfirmModal from '../../components/ui/ConfirmModal';
import UserDataModal from '../../components/ui/UserDataModal';
import UpdateOrderContentModal from '../../components/ui/UpdateOrderContentModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPen, faUndo, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import getAllBoxes from "../../services/api/boxes.js";
import ReferentAPI from "../../services/api/referents.js";



const OrdersLogistics = () => {
  const context = useContext(AppContext)
  const {token, user} = context

  const [filteredorders, setFilteredOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentOrder, setCurrentOrder] = useState({})
  const [numberPerPage, setNumberPerPage] = useState(50)
  const [pageItems, setPageItems] = useState([])
  const [orders, setOrders] = useState([])
  const [tmpSelectedItems, setTmpSelectedItems] = useState([])
  const [boxes, setBoxes] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [showUserData, setShowUserData] = useState(false)
  const [showUpdateOrderContent, setShowUpdateOrderContent] = useState(false)

  const dataToDisplay = {
    headers: [
     {name: "ID", fieldName: 'id'},
     {name: "Date", fieldName: 'created_at' },
     {name: "Prénom", fieldName: 'first_name' },
     {name: "Box", fieldName: 'box_name' },
     {name: "Statut Traitement", fieldName: 'received'},
     {name: "Actions", fieldName: 'actions'}
    ],
    items: pageItems
  }

  const dropdownOptions = ['5', '10', '50', '100', {value: orders.length, label: 'Tout'}]

	const updateReceivedOrder = async (order) => {
		order.received = true;
		order.date_received = new Date();
		await OrdersAPI.update(token, order)
    retrieveOrders(`&referent=${user.referent}`);
	}

	const undoReceivedOrder = async (order) => {
		order.received = false;
		delete order.date_received;
		await OrdersAPI.update(token, order)
    retrieveOrders(`&referent=${user.referent}`);
	}
	
  const retrieveOrders = async (params) => {
    let response = await OrdersAPI.getDeliveryOrders(token, params)
    let orders = response.data
    orders.map(order => {
      order.selected = false
			order.box_name = order.content[0].__component === 'commandes.box' ? order.content[0].box.title : 'Box sur mesure'
			order.actions = (
				<div className="tmp-table-actions">
					<button onClick={() => {
						setCurrentOrder(order);
						setShowUserData(true);
					}} className="tmp-button">
						<FontAwesomeIcon icon={faUserCircle} color="white" className="mr-2" /> Information anonymes
					</button>
					<button onClick={() => {
						setCurrentOrder(order);
						setShowUpdateOrderContent(true);
					}} className="tmp-button">
						<FontAwesomeIcon icon={faPen} color="white" className="mr-2" /> Modifier le contenu
					</button>
					{
						!order.received ? (
							<button onClick={() => {
								updateReceivedOrder(order)
							}} className="tmp-button">
								<FontAwesomeIcon icon={faPaperPlane} color="white" className="mr-2" /> Délivrée
							</button>
						) : (
							<button onClick={() => {
								undoReceivedOrder(order)
							}} className="tmp-button">
								<FontAwesomeIcon icon={faUndo} color="white" className="mr-2" /> Annuler la distribution
							</button>
						)
					}
				</div>
			)
    })
    setOrders(orders)
  }

	const retrieveBoxes = async () => {
		let response = await ReferentAPI.findOne(token, {id: user.referent})
		const referent = response.data
		response = await getAllBoxes(token, referent.environnement.slug)
    setBoxes(response.data)
  }

  const handleChangeNumPerPage = (e) => {
    setTmpSelectedItems([])
    setNumberPerPage(parseInt(e.value))
  }

  const handleSelectAll = (e) => {
    if(e.target.checked) {
      filteredorders.forEach(order => order.selected = e.target.checked)
      setTmpSelectedItems([...filteredorders])
    } else {
       filteredorders.forEach(order => order.selected = e.target.checked)
      setTmpSelectedItems([])
    }
  }

  const handleSpecificSelection = (e) => {
    let order = orders.find(order => order.id === parseInt(e.target.id))
    if(e.target.checked) {
      order.selected = e.target.checked
      tmpSelectedItems.push(order)
      setTmpSelectedItems([...tmpSelectedItems])
    } else {
      order.selected = false
      let array = tmpSelectedItems.filter(item => item.id !== order.id);
      setTmpSelectedItems([...array])
    }
  }

  const onPageChange = (event) => {
    setCurrentPage(event)
  }

	const handleSendClick = async (e) => {
    e.preventDefault()
    let ordersToSend = tmpSelectedItems.map(item => {
      item.received = true;
      item.date_received = new Date()
      return item
    })
    const res = await OrdersAPI.bulkUpdate(token, ordersToSend)
    if (res.status === 200) {
      setShowConfirm(true)
    }
  }

  useEffect(() => {
    retrieveBoxes()
    retrieveOrders(`&referent=${user.referent}`)
   }, [])


	useEffect(() => {
		const offset = (currentPage - 1) * numberPerPage;
		let tmpFiltered = orders.slice(offset, offset + numberPerPage)
		setPageItems([...tmpFiltered])
		setTmpSelectedItems([])
  }, [orders, currentPage, numberPerPage])
	
	return(
		<>
			<div className="px-4 relative">
				<div className="text-white text-sm uppercase hidden lg:inline-block font-semibold">
					Vos commandes
				</div>
				<div className={`fixed ${showConfirm ? "block" : "hidden"} inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50`}
				>
					{showConfirm &&
						<ConfirmModal setShow={setShowConfirm} />
					}
				</div>
				<div className={`fixed ${showUserData ? "block" : "hidden"} inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50`}
				>
					{
						showUserData  &&
						<UserDataModal closeModal={() => {
							setShowUserData(false)
							retrieveOrders(`&referent=${user.referent}`)
						}} boxes={boxes} order={currentOrder} />
					}
				</div>
				<div className={`fixed ${showUpdateOrderContent ? "block" : "hidden"} inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50`}
				>
					{
						showUpdateOrderContent  &&
						<UpdateOrderContentModal closeModal={() => {
							setShowUpdateOrderContent(false)
							retrieveOrders(`&referent=${user.referent}`)
						}} boxes={boxes} order={currentOrder} />
					}
				</div>
				<div className="tmp-table-option">
					<div className="tmp-top-buttons-container">
						<button className={`tmp-button ${tmpSelectedItems.length === 0 && 'disabled'}`} 
											data-for="send-tooltip"
											data-tip={`${tmpSelectedItems.length === 0 ? 'Sélectionnez des commandes afin de les marquer comme traitées' : ''}`}
											onClick={(e) => {
												if (tmpSelectedItems.length > 0) 
													handleSendClick(e)
											}}>
							<FontAwesomeIcon icon={faPaperPlane} color="white" className="mr-2" /> Marquer comme délivrée(s)
						</button>
					</div>
					<div className="tmp-dropdown-container" >
						<Dropdown className='tmp-dropdown' menuClassName="tmp-dropdown-menu" options={dropdownOptions} onChange={(e) => handleChangeNumPerPage(e)} value={numberPerPage.toString()} />
					</div>
				</div>
				<Table  dataToDisplay={dataToDisplay}
								handleSpecificSelection={handleSpecificSelection}
								handleSelectAll={handleSelectAll}
								title="Les commandes à traiter"  />
				{/* <div className="tmp-pagination-container">
					<Pagination
						currentPage={currentPage}
						totalSize={filteredorders.length}
						sizePerPage={numberPerPage}
						numberOfPagesNextToActivePage={3}
						changeCurrentPage={(event) => onPageChange(event)}
						theme="border-bottom"
					/>
				</div> */}
			</div>
		</>
		)
}

export default OrdersLogistics
