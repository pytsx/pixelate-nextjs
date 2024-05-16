
"use client"

import React from "react"

import AppBar from "@mui/material/AppBar"
import Button from "@mui/material/Button"
import Toolbar from "@mui/material/Toolbar"
import Tab from "@mui/material/Tab"
import TabList from "@mui/lab/TabList"

import { ModeSwitcher } from "./ModeSwitcher"
import { Mode, useEditor } from "@/lib"
import Stack from "@mui/material/Stack"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogActions from "@mui/material/DialogActions"
import { Divider, MenuItem, Typography } from "@mui/material"
import Image from "next/image"

export function AppAppBar() {
  const {
    state,
    newFile,
    setMode,
    downloadPng,
    uploadFile
  } = useEditor()

  const [open, setOpen] = React.useState(false);

  const openDialog = () => {
    setOpen((prevOpen) => !prevOpen);

  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        height: "fit-content",
        zIndex: 10000,
      }}
    >
      <Toolbar
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: ".25rem .25rem",
          height: "3.2rem",
          justifyContent: "space-between",
        })}>

        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={.5}
          sx={{

          }}
        >
          <Image
            src="/logo.png"
            alt="logo"
            width={64}
            height={64}
            style={{
              margin: "0 .32rem",
              imageRendering: "pixelated",
              scale: 1.2,
              transform: "translateY(.4rem) scaleX(-1)"
            }}
          />

          <Button
            onClick={openDialog}
            size="small"
            sx={(theme) => ({
              height: "3.2rem",
              border: "1px solid",
              borderTop: "none",
              borderBottom: "none",
              borderColor: theme.palette.grey[500],
              color: theme.palette.grey[800],
              ...theme.applyStyles("dark", {
                borderColor: theme.palette.grey[600],
                color: theme.palette.grey[500],
              })
            })}
          >
            file
          </Button>
          <Dialog
            onClose={closeDialog}
            open={open}
            sx={{
              "& .MuiDialog-paper": {
                width: "2rem 0",
                minWidth: "240px"
              }
            }}
          >
            <DialogTitle>File</DialogTitle>
            <MenuItem
              disabled={!!!state.imageData}
              onClick={() => {
                newFile()
                uploadFile()
                closeDialog()
              }}
            >
              upload
            </MenuItem>

            <Divider />

            <MenuItem
              disabled={!state.imageData}
              onClick={() => {
                downloadPng()
                closeDialog()

              }}>
              download (.png)
            </MenuItem>

            <DialogActions >
              <Button
                color='warning'
                onClick={closeDialog}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>

        {state.imageData
          && state.mode !== Mode.NEW
          && <TabList
            onChange={(e, value) => setMode(value)}
          >
            <Tab label="preprocess" value={Mode.PREPROCESS} />
            <Tab label="draw" value={Mode.DRAW} />
          </TabList>}
        <ModeSwitcher />
      </Toolbar>
    </AppBar>
  )
}