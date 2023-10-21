import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProjectsUrl } from "../../Constants";
import { getAsync } from "../../services/apiHandlerService";
import { DatePicker } from "@mui/x-date-pickers";
import { parseDateTime, toMoment } from "../../helpers/dateTimeHelpers";
import useGlobalStore from "../../store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import AppTable from "../../components/AppTable";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import ConfirmationModal from "../../components/ConfirmationModal";
import Loading from "../../components/Loading";

function EditProjectDetails() {
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const contacts = useGlobalStore((state) => state.contacts);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [estimate, setEstimate] = useState(0);
  const [vendorContactId, setVendorContactId] = useState("");
  const [details, setDetails] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [activeDeleteCategory, setActiveDeleteCategory] = useState({});
  const closeDeleteModal = () => {
    setActiveDeleteCategory({});
    setDeleteMessage("");
    setIsDeleteMode(false);
  };
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      const url = ProjectsUrl + `/${id}`;
      setIsLoading(true);
      const response = await getAsync(url);
      if (response.success) {
        setName(response.payload.name);
        setDescription(response.payload.description);
        setEstimate(response.payload.estimate);
        setVendorContactId(response.payload.vendor?._id);
        setDetails(response.payload.details);
        setEvents(response.payload.events);
        setCategories(response.payload.categories);
      }
      setIsLoading(false);
      // console.log("pageData: ", data);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  function setDetailValues(value, index, fieldName) {
    const _details = [...details];
    _details[index][fieldName] = value;
    setDetails(_details);
  }
  function appendDetail() {
    const _details = [...details];
    _details.push({ key: "", value: "" });
    setDetails(_details);
  }
  function removeDetail(index) {
    const _details = [...details];
    _details.splice(index, 1);
    setDetails(_details);
  }

  function setEventValues(value, index, fieldName) {
    const _events = [...events];
    _events[index][fieldName] = value;
    setEvents(_events);
  }
  function appendEvent() {
    const _events = [...events];
    _events.push({ name: "", description: "", date: "" });
    setEvents(_events);
  }
  function removeEvent(index) {
    const _events = [...events];
    _events.splice(index, 1);
    setEvents(_events);
  }

  function getContactDisplayName(contact) {
    return (
      contact.name +
      (contact.designation ? " (" + contact.designation + ")" : "")
    );
  }

  const submitEditProjectDetails = (e) => {
    e.preventDefault();
    console.log("submitted:.......");
    const isPayloadValid = validatePayloadData();
    if (isPayloadValid) {
      setIsLoading(true);
      axios
        .put(ProjectsUrl + `/${id}`, {
          name,
          description,
          estimate,
          vendor: vendorContactId,
          details,
          events,
        })
        .then((response) => {
          setMessage("Project details Updated Successfully");
          console.log(response);
          setIsLoading(false);
          navigate(`/projects/${id}`);
        })
        .catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    }
  };
  function validatePayloadData() {
    if (!(name && description && estimate)) {
      setMessage("Please complete all required fields");
      return false;
    }
    if (isNaN(Number(estimate))) {
      setMessage("Please enter a valid Estimate amount");
      return false;
    }
    if (details.find((detail) => detail.key.trim() === "")) {
      setMessage("Details: 'Name' cannot be empty");
      return false;
    }
    if (details.find((detail) => detail.value.trim() === "")) {
      setMessage("Details: 'Value' cannot be empty");
      return false;
    }
    if (events.find((event) => event.name.trim() === "")) {
      setMessage("Events: 'Name' cannot be empty");
      return false;
    }
    if (events.find((event) => event.description.trim() === "")) {
      setMessage("Events: 'Description' cannot be empty");
      return false;
    }
    console.log(
      "moment: ",
      events,
      events.find((event) => !moment(event.date).isValid())
    );
    if (events.find((event) => !event.date || !moment(event.date).isValid())) {
      setMessage("Events: Please enter a valid 'Event Date'");
      return false;
    }
    return true;
  }

  function submitDeleteCategory(e, categoryToDelete) {
    e.preventDefault();
    console.log("submitted delete.", categoryToDelete);
    let isDeleteAllowed = true;
    if (categoryToDelete?.categories?.length) {
      setDeleteMessage("Category having sub-categories cannot be deleted.");
      isDeleteAllowed = false;
      return;
    }
    if (isDeleteAllowed) {
      setIsLoading(true);
      axios
        .post(ProjectsUrl + "/remove-category", {
          categoryId: categoryToDelete?._id,
          projectId: id,
        })
        .then((response) => {
          console.log(response);
          setCategories(response.data.categories);
          setActiveDeleteCategory({});
          setDeleteMessage("");
          setIsDeleteMode(false);
          setIsLoading(false);
        })
        .catch((error) => {
          setDeleteMessage(error.response.data.message);
          console.log(error);
        });
    }
  }

  const categorySlots = {
    _id: ({ _, rowData }) => {
      return (
        <Button
          color="error"
          variant="contained"
          size="small"
          sx={{ m: 0.5 }}
          onClick={() => {
            setActiveDeleteCategory(rowData);
            setIsDeleteMode(true);
          }}
        >
          Delete
        </Button>
      );
    },
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={submitEditProjectDetails}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        mr: { lg: 5 },
      }}
    >
      <Typography variant="h6" color="gray">
        Edit Project Details
      </Typography>
      <Divider />
      <Box
        sx={{
          pt: 2,
          flexGrow: 1,
        }}
      >
        <TextField
          margin="normal"
          value={name}
          fullWidth
          required
          name="project-name"
          label="Project Name"
          size="small"
          multiline
          sx={{ bgcolor: "#fff", height: "fit-content" }}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextField
          margin="normal"
          value={description}
          fullWidth
          required
          name="project-description"
          label="Project Description"
          size="small"
          multiline
          sx={{ bgcolor: "#fff", height: "fit-content" }}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            margin="normal"
            value={estimate}
            fullWidth
            required
            name="project-estimate"
            label="Estimate"
            size="small"
            sx={{ bgcolor: "#fff", height: "fit-content", mr: 2 }}
            onChange={(e) => {
              setEstimate(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            value={vendorContactId}
            fullWidth
            name="vendor-contact"
            label="Project Vendor"
            size="small"
            select
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setVendorContactId(e.target.value);
            }}
          >
            <MenuItem value={""}>-</MenuItem>
            {contacts.map((contact) => (
              <MenuItem key={contact._id} value={contact._id}>
                {getContactDisplayName(contact)}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* EVENTS */}
        <Typography sx={{ fontSize: "1.2rem", mt: 3 }}>Events</Typography>
        {events &&
          events.map((event, index) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                    md: "row",
                    lg: "row",
                  },
                  mt: 1,
                  alignContent: "center",
                }}
                key={index}
              >
                <TextField
                  margin="normal"
                  value={event.name}
                  fullWidth
                  required
                  name="name"
                  label="Name"
                  size="small"
                  multiline
                  sx={{ bgcolor: "#fff", mr: 2, height: "fit-content" }}
                  onChange={(e) => {
                    setEventValues(e.target.value, index, e.target.name);
                  }}
                />
                <TextField
                  margin="normal"
                  value={event.description}
                  fullWidth
                  required
                  name="description"
                  label="Description"
                  size="small"
                  multiline
                  sx={{ bgcolor: "#fff", mr: 2, height: "fit-content" }}
                  onChange={(e) => {
                    setEventValues(e.target.value, index, e.target.name);
                  }}
                />
                <DatePicker
                  size="small"
                  value={toMoment(event.date)}
                  name="date"
                  label="Event Date"
                  sx={{ bgcolor: "#fff", mr: 2, p: 0 }}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      error: false,
                      margin: "normal",
                      required: true,
                    },
                  }}
                  onChange={(moment) =>
                    setEventValues(parseDateTime(moment), index, "date")
                  }
                />
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  sx={{ height: 40, my: 2 }}
                  onClick={() => removeEvent(index)}
                >
                  X
                </Button>
              </Box>
            );
          })}
        <Button
          variant="contained"
          sx={{ width: "100%", bgcolor: "#777", mt: 1, mb: 3 }}
          onClick={appendEvent}
        >
          Add Event
        </Button>

        {/* DETAILS */}
        <Typography sx={{ fontSize: "1.2rem", mt: 1 }}>Details</Typography>
        {details &&
          details.map((detail, index) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                    md: "row",
                    lg: "row",
                  },
                  mb: 1,
                  alignContent: "center",
                }}
                key={index}
              >
                <TextField
                  margin="normal"
                  value={detail.key}
                  required
                  fullWidth
                  name="key"
                  label="Name"
                  size="small"
                  multiline
                  sx={{ bgcolor: "#fff", mr: 2, height: "fit-content" }}
                  onChange={(e) => {
                    setDetailValues(e.target.value, index, e.target.name);
                  }}
                />
                <TextField
                  margin="normal"
                  value={detail.value}
                  required
                  fullWidth
                  name="value"
                  label="Value"
                  size="small"
                  multiline
                  sx={{ bgcolor: "#fff", height: "fit-content", mr: 2 }}
                  onChange={(e) => {
                    setDetailValues(e.target.value, index, e.target.name);
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  sx={{ height: 40, my: 2 }}
                  onClick={() => removeDetail(index)}
                >
                  X
                </Button>
              </Box>
            );
          })}
        <Button
          variant="contained"
          sx={{ width: "100%", bgcolor: "#777", mt: 1 }}
          onClick={appendDetail}
        >
          Add Detail
        </Button>
      </Box>

      <Typography sx={{ color: "red", mt: 1 }}>{message}</Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          color="grey"
          variant="contained"
          sx={{ mt: 2, mb: 2, mr: 2, bgcolor: "#fff" }}
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
          Save Changes
        </Button>
      </Box>

      <Divider />

      <AppTable
        name="Sub Categories"
        data={categories}
        columns={["name", "description", "_id"]}
        customColumns={{ _id: "Action" }}
        slots={categorySlots}
      />

      {/* Delete Category Modal */}
      <Modal open={isDeleteMode} onClose={closeDeleteModal}>
        <ConfirmationModal
          errorText={deleteMessage}
          confirmationText={
            <Typography variant="h6" sx={{ mt: 1 }}>
              Are you sure you want to Delete{" "}
              <Typography variant="a" sx={{ color: "blue" }}>
                {activeDeleteCategory.name}
              </Typography>{" "}
              category ?
            </Typography>
          }
          onCancel={closeDeleteModal}
          onConfirm={(e) => submitDeleteCategory(e, activeDeleteCategory)}
        />
      </Modal>

      {/* Loading Modal */}
      <Modal open={isLoading}>
        <Loading />
      </Modal>
    </Box>
  );
}

export default EditProjectDetails;
