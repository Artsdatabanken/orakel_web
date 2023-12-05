import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "../App.css";
import { runningOnMobile } from "../utils/utils";
import axios from "axios";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";

function ReportButton({ reportResult, croppedImages }) {
  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [encryptionData, setEncryptionData] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const openDialog = (e) => {
    if (runningOnMobile()) {
      saveImages(croppedImages);
    } else {
      setDialogOpen(true);
    }
  };

  function makeURL() {
    let prefix =
      window.location.hostname === "orakel.test.artsdatabanken.no"
        ? "test"
        : "www";

    let probability = Math.round(reportResult.probability * 100);
    let percentage = `%7Cpercentage%3D${probability}`;
    let url = `https://${prefix}.artsobservasjoner.no/SubmitSighting/`;
    let from = "meta=from%3Dorakel%7C";
    let platform = `platform%3Ddesktopweb`;
    let reporttype = `Report?`;

    if (runningOnMobile()) {
      // TODO: Await update from artsobsmobile before update, to ensure we don't redirect user to nonexistent page
      platform = `platform%3D${"web"}`;
      reporttype = `?scientificname=${reportResult.scientificNameID}%26`;

      url = "https://mobil.artsobservasjoner.no/#/";
      // REDIRECT TO THIS ONE
      // url += "report";
      url += "orakel";
    } else if (reportResult.scientificNameID) {
      reporttype = `ReportByScientificName/${reportResult.scientificNameID}?`;
    }
    return url + reporttype + from + platform + percentage;
  }

  function saveImages(croppedImages) {
    setUploadingImages(true);
    // Only use if on mobile for now
    var formdata = new FormData();
    for (let image of croppedImages) {
      formdata.append("image", image);
    }
    let url = "https://ai.artsdatabanken.no";
    // url = "http://localhost:5000"; // For testing the ai server script locally
    axios
      .post(url + "/save", formdata)
      .then((res) => {
        setEncryptionData(res.data);
        setDialogOpen(true);
        setUploadingImages(false);
      })
      .catch((error) => {
        console.log("error");
      });
  }

  function redirectToArtsObs() {
    let url = makeURL(reportResult);
    if (encryptionData) {
      let id = encryptionData.id;
      let password = encryptionData.password;
      url += "&id=" + id + "&password=" + password;
    }
    window.open(url, "_blank");
    setDialogOpen(false);
  }

  return (
    <React.Fragment>
      <div className="btn primary" onClick={openDialog.bind(this)}>
        {t("Report_button.Report")}
        {uploadingImages && <span className="littleSpinner"></span>}
      </div>

      <Dialog
        onClose={handleDialogClose}
        aria-labelledby="dialog-title"
        open={dialogOpen}
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          {t("Report_button.Did_you_verify")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("Report_button.Check_independently")}
          </DialogContentText>

          <form action="" method="post" encType="multipart/form-data"></form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {t("Report_button.Cancel")}
          </Button>
          <Button
            onClick={(e) => {
              redirectToArtsObs();
            }}
            color="primary"
            autoFocus
          >
            {t("Report_button.Continue")}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ReportButton;
