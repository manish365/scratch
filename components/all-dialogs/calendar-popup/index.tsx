import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Calendar from "react-calendar";
import { FaCheck, FaArrowAltCircleLeft } from "react-icons/fa";
import { server } from "../../../utils/server";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { CitySlotType } from "~types/index";
import { setCartMetaAreas, setCartMetaHikeDates } from "../../../store/reducers/cart";

const CalendarPopupModal = (props: any) => {
  const { metaData } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(new Date());
  const [saveDate, setSaveDate] = useState<any>("");
  const [error, setError] = useState<string>("");

  const [slots, setSlots] = useState<any[]>([]);
  const deliveryTypes = ["STANDARD", "SPECIAL"];
  const [_deliveryType, setDeliveryType] = useState("STANDARD");
  const [deliverySlots, setDeliverySlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>();

  const [citySlots, setCitySlots] = useState<CitySlotType[]>([]);

  const [midNightDelivery, setMidNightDelivery] = useState<boolean>(false);
  const midnightSlot = {
    _id: "64b55b0b6001bee46659a800",
    type: "MIDNIGHT",
    from: "23:00",
    to: "23:59",
  };

  const checkMidnightDelivery = (cityId: string) => {
    if (metaData?.areas?.length && cityId) {
      const filteredDelivery = metaData.areas.filter((a) => a._id === cityId)[0]?.delivery;
      if (filteredDelivery?.midNightDelivery) {
        setMidNightDelivery(true);
      }
      if (filteredDelivery?.deliveryPrice?.length) {
        setCitySlots(filteredDelivery?.deliveryPrice);
      }
    }
  }

  useEffect(() => {
    setShowModal(props.openModal.show);

    async function fetchProductDetailsMeta() {
      try {
        const res = await fetch(`${server}/product-details-meta`);
        const pdm = await res.json();
        if (pdm?.success) {
          setError("");
          setSlots(pdm.results.deliverySlot);
          if (pdm.results?.area?.length) {
            dispatch(setCartMetaAreas(pdm.results?.area));
          }
          if (pdm.results?.hikeDate?.length) {
            dispatch(setCartMetaHikeDates(pdm.results?.hikeDate));
          }
          setTimeout(() => { 
            updateDeliveryType("STANDARD");
          }, 0)
        }
      } catch (error) {
        setError("Sorry! Cannot get product details meta!");
      }
    }

    fetchProductDetailsMeta();
    if (props?.selectedCity) {
      checkMidnightDelivery(props.selectedCity);
    }
  }, []);
  const handleClose = () => {
    setShowModal(false);
    props.onClose();
    window.location.reload();
  };
  const goBack = () => {
    setSaveDate("");
  };
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  const isWeekend = (date: Date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday (0) or Saturday (6)
  };
  const tileClassName = ({ date }: { date: Date; view: any }) => {
    // console.log(date, view);
    let classes: any = [];

    if (isToday(date)) {
      classes.push("today");
    }
    if (isWeekend(date)) {
      classes.push("weekend");
    }
    if (date.getTime() === activeDate.getTime()) {
      classes.push("active-tab");
    }
    if (metaData?.hikeDates?.length) {
      metaData.hikeDates.forEach((hk) => {
        if (date.getTime() === new Date(hk.date).getTime()) {
          classes.push("delivery-price-hiked");
        }
      })
    }
    return classes.join(" ");

    // return isToday(date) && view === 'month' ? 'hide-active-tab' : '';
  };
  const handleClickCalendarDay = (value: Date) => {
    setActiveDate(value);

    if (isToday(value)) {
      handleDateChange(value);
    }
  };
  const handleDateChange = (selectedDate: any) => {
    setSelectedDate(selectedDate);
    saveModalDate(selectedDate);
  };
  const saveModalDate = (date: any) => {
    const formattedDate = date.toLocaleDateString("en-CA");
    setSaveDate(formattedDate);
  };

  const updateDeliveryType = (value: string = "") => {
    setDeliveryType(value);
    if (citySlots.length) {
      const selectedSlots = citySlots.filter(
        (s) => s.dtype.toUpperCase() === value.toUpperCase()
      );
      setDeliverySlots(selectedSlots);
    } else {
      // slots not filled from admin
      // continue with default approch
      const selectedSlots = slots.filter((s) => s.type.toUpperCase() === value);
      setDeliverySlots(selectedSlots);
    }
  };
  const updateDeliverySlot = (slot: any) => {
    if (isWithinCuttoffTime(slot)) {
      return;
    }
    setSelectedSlot(slot);
    const calendarModalData: any = {
      date: saveDate,
      slotTime: {
        ...slot,
        type: citySlots.length > 0 ? slot.dtype : slot?.type,
      },
    };
    setTimeout(() => {
      setShowModal(false);
      props.onClose();
    }, 400);

    props.onSaveModalData(calendarModalData);
  };

  const nthNumber = (number: number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const getFormattedDate = (date: Date) => {
    return `${date.getDate()} ${nthNumber(
      date.getDate()
    )} ${date.toLocaleString("default", { month: "long" })}`;
  }

  const isWithinCuttoffTime = (slot: CitySlotType) => {
    if (!slot?.cutoff || !slot?.from) { return false }
    if (!saveDate) { return false }
    const isTd = isToday(new Date(saveDate));
    if (!isTd) { return false }
    const currentTime = new Date().getHours();
    const allowedStartTime = +(slot.from.split(":")[0] || 0) - slot.cutoff;
    console.log(
      "slot",
      slot,
      "Date",
      saveDate,
      "allowedStartTime",
      allowedStartTime,
      "vs",
      currentTime
    );
    if (allowedStartTime > currentTime) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        id="calendar-modal"
      >
        <Modal.Header>
          <p style={{ fontSize: "20px" }} onClick={goBack}>
            {saveDate ? <FaArrowAltCircleLeft /> : ""}
          </p>
          <div className="heading-popup">
            <h4
              className="text-center modal-title"
              style={{ fontSize: "20px" }}
            >
              {!saveDate ? "Select Delivery Date" : "Select Shipping Method"}
            </h4>
          </div>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={handleClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body className="p-0 mx-0" style={{ minHeight: "410px" }}>
          {error && (
            <div className="flex px-4 py-2 mb-4 items-center w-full bg-red-300 text-error gap-2">
              <strong className="flex items-center gap-1">Error!</strong>
              {error}
            </div>
          )}
          <div className="w-100">
            <div className="modal-calendar">
              <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12 align-items-center justify-content-between">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0 m-0">
                  <div
                    className="row"
                    style={{ display: !saveDate ? "flex" : "none" }}
                  >
                    <Calendar
                      onChange={handleDateChange}
                      value={selectedDate}
                      calendarType="gregory"
                      minDate={new Date()}
                      tileClassName={tileClassName}
                      onClickDay={handleClickCalendarDay}
                    />
                  </div>
                  <div
                    className="custom-slots"
                    style={{ display: saveDate ? "block" : "none" }}
                  >
                    <div className="mt-4 w-100">
                      <div className="col-md-12 flex flex-col gap-4 flex-wrap align-items-start justify-content-center px-06">
                        {deliveryTypes.map((d) => (
                          <div key={d} className="flex w-full flex-col">
                            <div
                              className="flex items-center justify-between custom-slots-container"
                              onClick={() => updateDeliveryType(d)}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type={"radio"}
                                  name="deliveryTypes"
                                  id={`default-${d}`}
                                  value={d}
                                  className="appear-auto"
                                  onChange={() => updateDeliveryType(d)}
                                  checked={_deliveryType === d}
                                />
                                <label
                                  htmlFor={`default-${d}`}
                                  className="mb-0"
                                >
                                  {d}
                                </label>
                              </div>
                              <IoIosArrowDown />
                            </div>
                            {_deliveryType === d && (
                              <div>
                                <div className="col-md-12 flex gap-4 flex-wrap items-center justify-center">
                                  {deliverySlots.map((ds) => (
                                    <div
                                      key={ds._id}
                                      className={`
                                      border px-2 py-2 flex gap-2 items-center  time-slot ${
                                        isWithinCuttoffTime(ds)
                                          ? "line-through cursor-not-allowed text-red-600 bg-slate-100"
                                          : "pointer"
                                      }`}
                                      onClick={() => updateDeliverySlot(ds)}
                                      role="button"
                                    >
                                      {selectedSlot?._id === ds._id ? (
                                        <FaCheck style={{ color: "green" }} />
                                      ) : (
                                        ""
                                      )}
                                      <span>
                                        {ds.from} Hrs - {ds.to} Hrs
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {midNightDelivery && (
                          <div
                            key={"MIDNIGHT"}
                            className="flex w-full flex-col mb-4"
                          >
                            <div
                              className="flex items-center justify-between custom-slots-container"
                              onClick={() => updateDeliveryType("MIDNIGHT")}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type={"radio"}
                                  name="deliveryTypes"
                                  id={`default-MIDNIGHT`}
                                  value={"MIDNIGHT"}
                                  className="appear-auto"
                                  onChange={() =>
                                    updateDeliveryType("MIDNIGHT")
                                  }
                                  checked={_deliveryType === "MIDNIGHT"}
                                />
                                <label
                                  htmlFor={`default-MIDNIGHT`}
                                  className="mb-0"
                                >
                                  Midnight Delivery
                                </label>
                              </div>
                              <IoIosArrowDown />
                            </div>
                            {_deliveryType === "MIDNIGHT" && (
                              <div className="col-md-12 flex gap-4 flex-wrap items-center justify-center">
                                <p>
                                  (Your Order Will Be Delivered On the Night of
                                  <span className="text-red-600 ml-1 bold">
                                    {getFormattedDate(selectedDate)}
                                  </span>
                                  )
                                </p>
                                <div
                                  className="border px-2 py-2 flex gap-2 items-center pointer time-slot"
                                  onClick={() =>
                                    updateDeliverySlot(midnightSlot)
                                  }
                                  role="button"
                                >
                                  {selectedSlot?._id === midnightSlot._id ? (
                                    <FaCheck style={{ color: "green" }} />
                                  ) : (
                                    ""
                                  )}
                                  <p className="flex flex-col justify-center gap-2">
                                    <span>Mid Night Delivery</span>
                                    <span>
                                      {midnightSlot.from} Hrs -{" "}
                                      {midnightSlot.to} Hrs
                                    </span>
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export { CalendarPopupModal };
