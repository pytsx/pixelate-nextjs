/**
 * Copyright 2024 Henrique de Lima Pessoa
 * 
 * See the NOTICE file distributed with this work for 
 * additional information regarding copyright ownership.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    https://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * This project is based on https://github.com/google/pixelate which is licensed under the Apache 2.0 License.
 * 
 * Copyright 2022 Google LLC
 */

"use client"

import React from "react"
import Image from "next/image"

import AppBar from "@mui/material/AppBar"
import Button from "@mui/material/Button"
import Toolbar from "@mui/material/Toolbar"
import Tab from "@mui/material/Tab"
import TabList from "@mui/lab/TabList"
import Stack from "@mui/material/Stack"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogActions from "@mui/material/DialogActions"
import Divider from "@mui/material/Divider"
import MenuItem from "@mui/material/MenuItem"

import { Mode, useEditor, useStore } from "@/lib"

import { ModeSwitcher } from "./ModeSwitcher"

export function AppAppBar() {

  const {
    newFile,
    downloadPng,
    uploadFile,
  } = useEditor()

  const {
    setMode,
    store
  } = useStore()

  const [open, setOpen] = React.useState(false)
  const openDialog = () => { setOpen((prevOpen) => !prevOpen) }
  const closeDialog = () => { setOpen(false) }

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
            onClick={newFile}
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
              disabled={!store.imageData}
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

        {store.imageData
          && store.mode !== Mode.NEW
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