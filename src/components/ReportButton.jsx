import React, { useState } from "react";
import "../App.css";
import { runningOnMobile } from "../utils/utils";
import axios from "axios";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { aiApiUrl } from "../config";
import { useTranslation } from "../i18n";

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
      platform = `platform%3D${"web"
        }`;
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
    axios
      .post(`${aiApiUrl}/save`, formdata)
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
      <button
        type="button"
        className="speciesDetail__reportLink"
        onClick={openDialog}
      >
        <span>{t("report_dialog_title")}</span>
        <span className="speciesDetail__external" aria-hidden>
          <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M1.33333 12C0.966667 12 0.652778 11.8694 0.391667 11.6083C0.130556 11.3472 0 11.0333 0 10.6667V1.33333C0 0.966667 0.130556 0.652778 0.391667 0.391667C0.652778 0.130556 0.966667 0 1.33333 0H6V1.33333H1.33333V10.6667H10.6667V6H12V10.6667C12 11.0333 11.8694 11.3472 11.6083 11.6083C11.3472 11.8694 11.0333 12 10.6667 12H1.33333ZM4.46667 8.46667L3.53333 7.53333L9.73333 1.33333H7.33333V0H12V4.66667H10.6667V2.26667L4.46667 8.46667Z"
            />
          </svg>
        </span>
        {uploadingImages && <span className="littleSpinner"></span>}
      </button>

      <Dialog
        onClose={handleDialogClose}
        aria-labelledby="dialog-title"
        open={dialogOpen}
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          {t("report_dialog_title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("report_dialog_message")}
          </DialogContentText>

          <form action="" method="post" encType="multipart/form-data"></form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {t("cancel")}
          </Button>
          <Button
            onClick={(e) => {
              redirectToArtsObs();
            }}
            color="primary"
            autoFocus
          >
            {t("report_dialog_continue")}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ReportButton;
