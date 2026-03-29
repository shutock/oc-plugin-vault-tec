// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import { VignetteEffect } from "@opentui/core"
import { useTerminalDimensions } from "@opentui/solid"
import type { TuiPlugin, TuiPluginModule, TuiSlotPlugin, TuiThemeCurrent } from "@opencode-ai/plugin/tui"
import { Show, createMemo, createSignal } from "solid-js"
import {
  SettingsDialog,
  createSettingKey,
  settingByField,
  type Field,
  type NumberField,
  type SettingsState,
  type ToggleField,
} from "./settings-dialog"
import { Tips } from "./tips"

const id = "vault-tec"

const home = [
  "__      __         _ _      _______         ",
  "\\ \\    / /        | | |    |__   __|        ",
  " \\ \\  / /_ _ _   _| | |_      | | ___  ___ ",
  "  \\ \\/ / _` | | | | | __|     | |/ _ \\/ __|",
  "   \\  / (_| | |_| | | |_      | |  __/ (__ ",
  "    \\/ \\__,_|\\__,_|_|\\__|     |_|\\___|\\___|",
]

const home2 = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣄⣴⣿⣿⣶⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣄⣠⠾⠛⠿⠃⠈⠻⣿⢿⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⣸⠿⢃⣴⣿⣶⣶⠾⣶⣼⣤⣤⠸⣧⠻⣷⣦⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣧⢋⣦⢶⣿⡿⣿⣿⡷⣌⣿⢿⢁⢼⣿⡎⠿⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣤⣿⣿⣿⠟⠋⣼⣏⣸⡏⢣⢧⣧⣠⢹⣿⣭⢑⢕⠻⠀⠀⠀⠙⠻⣿⣿⣿⣦⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢯⣶⣿⢸⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⣿⣿⣿⡀⢿⣿⡟⣿⣿⣾⣬⣕⣕⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡸⣿⣏⢾⣿⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⢿⠸⣛⣛⣛⣛⡭⠌⣻⣿⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⢘⣛⣃⣙⠿⣮⡛⢿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠘⢿⣶⡊⢩⣵⣾⣷⣿⡟⠝⣠⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⣿⡛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠿⠿⠿⠿⣿⡎⢿⡌⢙⣋⣀⠀⠀⠀⠀⢀⣀⣀⣌⠛⢿⣿⣿⣿⣿⣟⡁⣴⣯⢙⡻⢿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣶⡜⡿⠃⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣷⣄⣉⣉⣛⣡⣾⡿⢃⣾⣿⣷⣯⡳⡀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⣀⣤⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⡃⣶⣶⣶⣮⠕⡿⠀⣸⣿⣿⣿⣿⣿⣿⡟⣿⣿⣿⡷⢹⣿⣿⣿⠿⢟⣩⣴⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣤⣀⠀⠀",
  "⠐⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣜⣛⣂⡊⠁⠴⠿⠿⠿⠟⠛⠛⠉⠁⣿⣿⣿⡇⣿⣿⣿⡇⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⠂",
  "⠀⠀⠀⠉⠛⠛⠛⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⢿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⢱⣿⣿⣿⢡⣿⣿⣿⣿⣶⣭⣛⠿⢿⣿⣿⣿⣿⣿⣆⠀⠀⠀⢸⣿⣿⡿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠛⠛⠛⠁⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⢸⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⡏⣸⣷⢢⣿⣿⣿⣿⡟⠀⠀⠀⣼⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣆⠀⠀⠀⠀⠀⠀⢸⣿⣿⢸⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⢃⡿⣣⣿⣿⣿⣿⡟⠀⠀⠀⢠⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣴⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣿⣿⣿⣆⠀⠀⠀⠀⠀⢰⣬⣛⢸⣿⣿⣿⢸⣿⣿⣿⠿⠿⢛⠘⢡⣿⣿⣿⣿⡟⠀⠀⠀⢠⣿⣿⣿⣷⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣷⣶⣶⣶⣾⣿⣿⢀⣦⣙⠻⠿⠟⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⢭⣛⡻⠿⠿⣿⣿⣿⠿⠿⠿⢛⣃⡈⣿⣿⡟⠴⡄⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠿⠿⠿⠿⠿⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣷⣦⡀⠸⣿⣿⣿⣿⣶⣶⣶⣿⣿⣿⣿⣿⣧⠙⠛⠛⢒⣡⣾⣿⣿⠿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣿⣿⣷⣆⣉⠙⠛⠻⠿⠿⠿⠿⠿⠟⠛⠋⢁⣰⣾⣿⣿⡿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⣿⣿⣿⣿⣷⣶⣶⣶⣶⣶⣶⣶⣶⣿⣿⣿⣿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠊⣹⠁⠀⡀⣬⢰⡆⡇⡀⠀⢀⠀⡤⠀⠀⠀⠈⠙⠛⠻⠿⠿⠿⠿⠿⠿⠿⠛⠛⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡞⠀⢠⠇⡼⢡⠇⡇⡞⠈⠓⠁⠃⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠓⣡⡞⠀⠑⠉⠀⠀⠀⠀⠀⢸⣿⢀⣿⡇⣿⢿⡇⢸⣿⢸⣿⢸⣿⠸⢿⣿⠿⠀⠸⢿⣿⠿⢸⣿⠛⢠⣾⠛⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⡱⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⢠⣿⢸⣇⢸⣿⢸⣿⢸⣿⠀⢸⣿⢠⣤⡄⢸⣿⠀⢸⣿⠶⢸⣿⠀⣉⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⡿⢸⣿⢹⣿⠸⣿⣼⡿⢸⣿⣤⢸⣿⠀⠀⠀⢸⣿⠀⠸⣿⣤⡌⣿⣤⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
]

const width = (list: string[]) => {
  return Math.max(...list.map((line) => line.length))
}

const home2w = width(home2)

const side = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⣤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⢀⣄⠀⣠⠶⠲⠞⠁⠀⠙⠛⠳⣆⠀⠀⠀⠀⠀",
  "⠀⡟⠙⠛⠁⣀⣀⢀⡤⢤⠀⠀⠀⠙⢷⣄⠀⠀⠀",
  "⢠⡷⢄⣠⠊⠀⠀⠁⠀⡀⠑⠒⠈⢳⠀⢻⡆⠀⠀",
  "⠀⣷⠃⢠⡀⠀⠀⠀⠀⠈⠀⠀⠀⢎⠀⢸⡇⠀⠀",
  "⢠⡇⠀⠘⢁⡄⠀⠀⠉⠉⠀⠀⠀⣳⢧⣾⠃⠀⠀",
  "⢸⡇⠀⠀⠘⠆⠀⠀⢀⠀⠀⠀⠀⠁⢿⡏⠀⠀⠀",
  "⠈⣇⠸⢖⡀⠀⠐⣂⠹⡇⠀⠀⠀⣀⣼⠇⠀⠀⠀",
  "⠀⠹⣦⠀⠈⠭⠉⠀⠀⠀⠀⣠⡾⠉⠁⠀⠀⠀⠀",
  "⠀⠀⠈⠳⢦⣄⣀⣀⣠⡴⠞⠋⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠈⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
]

type Cfg = {
  enabled: boolean
  theme: string
} & SettingsState

type Api = Parameters<TuiPlugin>[0]

const settingKey = createSettingKey(id)

const rec = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return
  return Object.fromEntries(Object.entries(value))
}

const pick = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback
  if (!value.trim()) return fallback
  return value
}

const bool = (value: unknown, fallback: boolean) => {
  if (typeof value !== "boolean") return fallback
  return value
}

const num = (value: unknown, fallback: number) => {
  if (typeof value !== "number") return fallback
  return value
}

const cfg = (opts: Record<string, unknown> | undefined): Cfg => {
  return {
    enabled: bool(opts?.enabled, true),
    theme: pick(opts?.theme, "vault-tec"),
    set: bool(opts?.set_theme, true),
    scan: bool(opts?.scanlines, true),
    scanSpeed: Math.max(0, num(opts?.scanline_speed, 0.012)),
    vignette: Math.max(0, num(opts?.vignette, 0.75)),
    sidebar: bool(opts?.sidebar, true),
    tips: bool(opts?.tips, true),
  }
}

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min
  if (value > max) return max
  return value
}

const withKV = (api: Api, value: Cfg): Cfg => {
  return {
    ...value,
    set: bool(api.kv.get(settingKey.set, value.set), value.set),
    scan: bool(api.kv.get(settingKey.scan, value.scan), value.scan),
    scanSpeed: Math.max(0, num(api.kv.get(settingKey.scanSpeed, value.scanSpeed), value.scanSpeed)),
    vignette: clamp(num(api.kv.get(settingKey.vignette, value.vignette), value.vignette), 0, 1),
    sidebar: bool(api.kv.get(settingKey.sidebar, value.sidebar), value.sidebar),
    tips: bool(api.kv.get(settingKey.tips, value.tips), value.tips),
  }
}

const Home = (props: { theme: TuiThemeCurrent }) => {
  const dim = useTerminalDimensions()
  const [gap, setGap] = createSignal({
    width: 0,
    height: 0,
  })
  const logo = createMemo(() => {
    const term = dim()
    const chrome = gap()
    const h = Math.max(0, term.height - chrome.height)
    const w = Math.max(0, term.width - chrome.width)
    if (h >= home2.length && w >= home2w) return home2
    return home
  })

  return (
    <box
      onSizeChange={function () {
        const term = dim()
        const own = {
          width: this.width,
          height: this.height,
        }
        const next = {
          width: Math.max(0, term.width - own.width),
          height: Math.max(0, term.height - own.height),
        }
        const wide = own.width >= home2w
        setGap((prev) => {
          const width = wide ? (prev.width > 0 ? Math.min(prev.width, next.width) : next.width) : prev.width
          const height = prev.height > 0 ? Math.min(prev.height, next.height) : next.height
          if (prev.width === width && prev.height === height) return prev
          return {
            width,
            height,
          }
        })
      }}
      flexDirection="column"
      alignItems="center"
    >
      {(() => {
        const lines = logo()
        const big = lines === home2
        return lines.map((line, i) => (
          <text fg={big ? props.theme.text : i < 2 ? props.theme.textMuted : props.theme.text}>{line}</text>
        ))
      })()}
    </box>
  )
}

const Side = (props: { theme: TuiThemeCurrent }) => {
  return (
    <box
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={1}
      paddingRight={1}
      alignItems="center"
    >
      <box flexDirection="column">
        {side.map((line) => (
          <text fg={props.theme.textMuted} selectable={false}>
            {line}
          </text>
        ))}
      </box>
    </box>
  )
}

const Card = (props: { theme: TuiThemeCurrent; session: string }) => {
  return (
    <box
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={2}
      paddingRight={2}
      flexDirection="column"
      gap={1}
    >
      <text fg={props.theme.primary}>
        <b>Vault-Tec monitor</b>
      </text>
      <text fg={props.theme.textMuted}>session {props.session.slice(0, 8)}</text>
      <text fg={props.theme.success}>Vault seal integrity: NOMINAL</text>
    </box>
  )
}

const slot = (api: Api, value: () => Cfg): TuiSlotPlugin[] => {
  return [
    {
      slots: {
        home_logo(ctx) {
          return <Home theme={ctx.theme.current} />
        },
      },
    },
    {
      order: 50,
      slots: {
        sidebar_content(ctx) {
          return (
            <Show when={value().sidebar}>
              <Side theme={ctx.theme.current} />
            </Show>
          )
        },
      },
    },
    {
      order: 650,
      slots: {
        sidebar_content(ctx, input) {
          return (
            <Show when={value().sidebar}>
              <Card theme={ctx.theme.current} session={input.session_id} />
            </Show>
          )
        },
      },
    },
    {
      order: 100,
      slots: {
        home_bottom(ctx) {
          const hide = createMemo(() => api.kv.get("tips_hidden", false))
          const first = createMemo(() => api.state.session.count() === 0)
          const show = createMemo(() => !first() && !hide())
          return (
            <Show when={value().tips}>
              <Tips theme={ctx.theme.current} show={show()} />
            </Show>
          )
        },
      },
    },
  ]
}

const scan = (v: number, speed: number, enabled: boolean) => {
  const vignette = new VignetteEffect(v)
  let time = 0
  return (buf: Parameters<typeof vignette.apply>[0], dt: number) => {
    if (enabled) {
      const w = buf.width
      const h = buf.height
      const fg = buf.buffers.fg
      const bg = buf.buffers.bg
      time += dt

      // Multiple v-sync bands moving bottom-to-top at the same speed
      // Each band has a different size, boost, and phase offset
      const bands = [
        { size: 6, boost: 0.35, phase: 0 },
        { size: 8, boost: 0.25, phase: 0.35 },
        { size: 5, boost: 0.3, phase: 0.7 },
      ]

      // Build per-row brightness multiplier
      const rowBoost = new Float32Array(h)
      for (const band of bands) {
        // All bands move upward at the same speed, offset by phase
        const pos = (1 - (((time * speed) / h + band.phase) % 1)) * h
        const half = band.size / 2
        for (let i = 0; i < band.size; i++) {
          const y = Math.floor(pos + i) % h
          const dist = Math.abs(i - half) / half
          rowBoost[y] += (1 - dist * dist) * band.boost
        }
      }

      // Apply per-row
      for (let y = 0; y < h; y++) {
        const b = rowBoost[y]
        if (b === 0) continue
        const mult = 1 + b
        for (let x = 0; x < w; x++) {
          const ci = (y * w + x) * 4
          fg[ci] = Math.min(1, fg[ci] * mult)
          fg[ci + 1] = Math.min(1, fg[ci + 1] * mult)
          fg[ci + 2] = Math.min(1, fg[ci + 2] * mult)
          bg[ci] = Math.min(1, bg[ci] * mult)
          bg[ci + 1] = Math.min(1, bg[ci + 1] * mult)
          bg[ci + 2] = Math.min(1, bg[ci + 2] * mult)
        }
      }
    }

    // Vignette
    vignette.apply(buf)
  }
}

const tui: TuiPlugin = async (api, options) => {
  const boot = cfg(rec(options))
  if (!boot.enabled) return

  const [value, setValue] = createSignal(withKV(api, boot))

  await api.theme.install("./vault-tec.json")
  if (value().set) {
    api.theme.set(value().theme)
  }

  let tips = false
  const disableTips = async () => {
    if (tips) return
    const item = api.plugins.list().find((entry) => entry.id === "internal:home-tips")
    if (!item?.enabled || !item.active) return
    const ok = await api.plugins.deactivate("internal:home-tips")
    if (!ok) {
      api.ui.toast({
        variant: "warning",
        message: "Vault tips enabled, but default tips could not be disabled.",
      })
      return
    }
    tips = true
  }

  const restoreTips = async () => {
    if (!tips) return
    const ok = await api.plugins.activate("internal:home-tips")
    if (!ok) {
      api.ui.toast({
        variant: "warning",
        message: "Failed to restore default home tips.",
      })
      return
    }
    tips = false
  }

  const write = (key: Field, next: unknown) => {
    api.kv.set(settingKey[key], next)
  }

  let post: ReturnType<typeof scan> | undefined
  let live = false
  const applyScan = () => {
    if (post) {
      api.renderer.removePostProcessFn(post)
      post = undefined
    }

    const state = value()
    const hasVignette = state.vignette > 0
    if (!state.scan && !hasVignette) {
      if (live) {
        api.renderer.dropLive()
        live = false
      }
      return
    }

    post = scan(state.vignette, state.scanSpeed, state.scan)
    api.renderer.addPostProcessFn(post)

    if (state.scan && !live) {
      api.renderer.requestLive()
      live = true
    }

    if (!state.scan && live) {
      api.renderer.dropLive()
      live = false
    }
  }

  const update = (key: Field, next: unknown) => {
    const prev = value()
    if (prev[key] === next) return
    const state = {
      ...prev,
      [key]: next,
    }
    setValue(state)
    write(key, state[key])

    if (key === "set" && state.set) {
      api.theme.set(state.theme)
    }

    if (key === "scan" || key === "scanSpeed" || key === "vignette") {
      applyScan()
    }

    if (key === "tips") {
      if (state.tips) {
        void disableTips()
      } else {
        void restoreTips()
      }
    }
  }

  const flip = (key: ToggleField) => {
    update(key, !value()[key])
  }

  const tune = (key: NumberField, dir: -1 | 1) => {
    const item = settingByField[key]
    if (!item || item.kind !== "number") return
    let next = value()[key] + (item.step ?? 1) * dir
    if (typeof item.min === "number") next = Math.max(item.min, next)
    if (typeof item.max === "number") next = Math.min(item.max, next)
    next = Number(next.toFixed(item.digits ?? 3))
    update(key, next)
  }

  const showSettings = () => {
    api.ui.dialog.replace(() => <SettingsDialog api={api} value={value} flip={flip} tune={tune} />)
  }

  if (value().tips) {
    await disableTips()
  }
  applyScan()

  api.command.register(() => [
    {
      title: "Vault-Tec settings",
      value: "vault-tec.settings",
      category: "System",
      onSelect() {
        showSettings()
      },
    },
    {
      title: api.kv.get("tips_hidden", false) ? "Show tips" : "Hide tips",
      value: "tips.toggle",
      keybind: "tips_toggle",
      category: "System",
      hidden: api.route.current.name !== "home" || !value().tips,
      onSelect() {
        if (!value().tips) return
        api.kv.set("tips_hidden", !api.kv.get("tips_hidden", false))
        api.ui.dialog.clear()
      },
    },
  ])

  api.lifecycle.onDispose(async () => {
    await restoreTips()
    if (post) {
      api.renderer.removePostProcessFn(post)
    }
    if (live) {
      api.renderer.dropLive()
    }
  })

  for (const item of slot(api, value)) {
    api.slots.register(item)
  }
}

const plugin: TuiPluginModule & { id: string } = {
  id,
  tui,
}

export default plugin
