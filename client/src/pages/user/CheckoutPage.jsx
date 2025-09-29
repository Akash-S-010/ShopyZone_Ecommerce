import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import Loader from '../../components/shared/Loader';
import { toast } from 'react-hot-toast';
import useCartStore from '../../store/cartStore';
import useAddressStore from '../../store/addressStore';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const getCart = useCartStore((s) => s.getCart);
  const clearCart = useCartStore((s) => s.clear);
  const addresses = useAddressStore((s) => s.addresses);
  const hydrateAddresses = useAddressStore((s) => s.hydrate);

  const [addressId, setAddressId] = useState('');
  const [paymentType, setPaymentType] = useState('COD');
  const [placing, setPlacing] = useState(false); // Define placing state
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await getCart();
      await hydrateAddresses();
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!addressId && addresses.length > 0) {
      setAddressId(addresses[0]._id);
    }
  }, [addresses, addressId]);

  const deliveryFee = 20; // default delivery fee
  const subtotal = (items || []).reduce((t, i) => t + (i.product.discountPrice || i.product.price || 0) * i.quantity, 0);
  const total = subtotal + deliveryFee;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async () => {
    if (!addressId) return alert("Please select a delivery address");
    setPlacing(true);
    try {
      const selectedAddress = addresses.find((a) => a._id === addressId);
      if (!selectedAddress) {
        setPlacing(false);
        return alert("Selected address not found.");
      }

      const payload = {
        items: items.map((i) => ({
          product: i.product._id || i.product,
          quantity: i.quantity,
        })),
        total: total, // Use 'total' instead of 'totalPrice'
        address: selectedAddress,
        paymentType,
      };

      if (paymentType === "COD") {
        const { data } = await axios.post("/api/orders/place-order", payload);
        clearCart(); // Clear cart after successful order placement
        setPlacing(false);
        navigate("/orders");
      } else if (paymentType === "Razorpay") {
        const { data } = await axios.post("/api/orders/create-razorpay-order", payload);

        const { orderId, currency, amount, dbOrderId, key } = data;

        const loadRzp = () =>
          new Promise((resolve, reject) => {
            if (window.Razorpay) return resolve();
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });

        await loadRzp();

        const options = {
          key: key,
          amount: amount,
          currency: currency,
          name: "E-commerce App",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response) {
            try {
              await axios.post("/api/orders/razorpay/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: dbOrderId,
              });
              clearCart(); // Clear cart after successful payment
              setPlacing(false);
              navigate("/orders");
            } catch (err) {
              setPlacing(false);
              alert(err?.response?.data?.message || "Payment verification failed");
            }
          },
          modal: {
            ondismiss: async function () {
              try {
                await axios.post("/api/orders/razorpay/cancel-payment", {
                  dbOrderId: dbOrderId,
                });
                setPlacing(false);
                hydrateCart();
              } catch (err) {
                setPlacing(false);
                hydrateCart();
              }
            },
          },
          prefill: {
            // optional: fill with user's data if available
          },
          theme: { color: "#F37254" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setPlacing(false);
      alert(err?.response?.data?.message || "Order failed");
    }
  };

  if (loading) return <Loader className="min-h-screen" />;

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
        <div className="space-y-3">
          {addresses.map(a => (
            <label key={a._id} className="flex items-start gap-3 border rounded p-3">
              <input type="radio" name="addr" checked={addressId===a._id} onChange={() => setAddressId(a._id)} />
              <div>
                <div className="font-semibold">{a.Address}</div>
                <div className="text-gray-700">{a.street}, {a.city}, {a.state} - {a.pincode}</div>
              </div>
            </label>
          ))}
          {addresses.length === 0 && <div className="text-gray-600">No addresses. Add one first.</div>}
          <button onClick={() => navigate('/addresses')} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Manage Addresses</button>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">Payment</h2>
        <select value={paymentType} onChange={(e)=>setPaymentType(e.target.value)} className="border p-2 rounded">
          <option value="COD">Cash on Delivery</option>
          <option value="Razorpay">Razorpay</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded-md shadow h-fit">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.product._id} className="flex justify-between text-sm">
              <span>{i.product.name} x {i.quantity}</span>
              <span>₹{((i.product.discountPrice || i.product.price || 0) * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery</span>
            <span>₹{deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
        <button onClick={placeOrder} className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Place Order</button>
      </div>
    </div>
  );
};

export default CheckoutPage;


