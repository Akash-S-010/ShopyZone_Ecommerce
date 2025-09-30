import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import Loader from "../../components/shared/Loader";
import useCartStore from "../../store/cartStore";
import useAddressStore from "../../store/addressStore";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.cart) || []; // Ensure items is always an array
  const getCart = useCartStore((s) => s.getCart);
  const clearCart = useCartStore((s) => s.clear);
  const addresses = useAddressStore((s) => s.addresses) || []; // Ensure addresses is always an array
  const hydrateAddresses = useAddressStore((s) => s.hydrate);

  const [addressId, setAddressId] = useState("");
  const [paymentType] = useState("Razorpay");
  const [placing, setPlacing] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const deliveryFee = 20;
  const subtotal = items.reduce(
    (t, i) =>
      t + (i.product?.discountPrice || i.product?.price || 0) * i.quantity,
    0
  );
  const total = subtotal + deliveryFee;

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
          product: i.product?._id || i.product,
          quantity: i.quantity,
        })),
        total: total,
        address: selectedAddress,
        paymentType,
      };

      if (paymentType === "COD") {
        await axios.post("/orders/place-order", payload);
        clearCart();
        setPlacing(false);
        navigate("/orders");
      } else if (paymentType === "Razorpay") {
        const { data } = await axios.post(
          "/orders/create-razorpay-order",
          payload
        );

        const { orderId, currency, amount, dbOrderId, key } = data;

        if (!key) {
          setPlacing(false);
          return alert("Razorpay key is missing. Please contact support.");
        }

        const loadRzp = () =>
          new Promise((resolve, reject) => {
            if (window.Razorpay) return resolve();
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            script.onerror = () => {
              setPlacing(false);
              reject(new Error("Failed to load Razorpay script."));
            };
            document.body.appendChild(script);
          });

        try {
          await loadRzp();
        } catch (err) {
          setPlacing(false);
          return alert(err.message);
        }

        const options = {
          key: key,
          amount: amount,
          currency: currency,
          name: "E-commerce App",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response) {
            try {
              await axios.post("/orders/razorpay/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: dbOrderId,
              });
              clearCart();
              setPlacing(false);
              navigate("/orders");
            } catch (err) {
              console.error("Client-side payment verification error:", err);
              setPlacing(false);
              alert(
                err?.response?.data?.message || "Payment verification failed"
              );
            }
          },
          modal: {
            ondismiss: async function () {
              try {
                await axios.post("/orders/razorpay/cancel-payment", {
                  dbOrderId: dbOrderId,
                });
                setPlacing(false);
                await getCart();
              } catch (err) {
                setPlacing(false);
                await getCart();
              }
            },
          },
          prefill: {},
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
    <>
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping + Payment Section */}
        <div className="lg:col-span-2 bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <div className="text-gray-600">No addresses. Add one first.</div>
            ) : (
              addresses.map((a) => (
                <label
                  key={a._id}
                  className="flex items-start gap-3 border rounded p-3"
                >
                  <input
                    type="radio"
                    name="addr"
                    checked={addressId === a._id}
                    onChange={() => setAddressId(a._id)}
                  />
                  <div>
                    <div className="font-semibold">{a.Address}</div>
                    <div className="text-gray-700">
                      {a.street}, {a.city}, {a.state} - {a.pincode}
                    </div>
                  </div>
                </label>
              ))
            )}
            <button
              onClick={() => navigate("/addresses")}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Manage Addresses
            </button>
          </div>

          <h2 className="text-xl font-bold mt-8 mb-4">Payment</h2>
          <p className="text-lg">Razorpay</p>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white p-4 rounded-md shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="text-gray-500 text-center">
                No items in the cart.
              </div>
            ) : (
              items.map((i, idx) => (
                <div
                  key={i.product?._id || idx}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {i.product?.name || "Unnamed Product"} x {i.quantity}
                  </span>
                  <span>
                    ₹
                    {(
                      (i.product?.discountPrice || i.product?.price || 0) *
                      i.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))
            )}
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
          <button
            onClick={placeOrder}
            disabled={placing || items.length === 0}
            className={`w-full mt-4 py-2 rounded-md text-white ${
              placing || items.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
