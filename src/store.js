import { createStore } from "vuex";

import { downloadFromBlob } from "pentatrion-lib/downloadHelper";
import { toIsoString } from "pentatrion-lib/dateHelper";
import { formFetchOrNotify, fetchOrNotify } from "pentatrion-lib/apiHelper";

import { parseSelection } from "./utils/filters";
import { checkAndFixValidation, completeUploadOptions } from "./utils/complete";
import { isValidFile, isEditableFile } from "./utils/validation";

export default function createStoreWithOptions(
  {
    canEditImageSize,
    debug,
    endPoint,
    entryPoints,
    form,
    fileUpload,
    fileValidation,
    indexes,
    selection,
    showValidationString,
    themePrefix,

    multiple,
  },
  isModal,
) {
  let debugStr = debug ? "?XDEBUG_TRIGGER" : "";

  let backendOrigin = null;
  try {
    let url = new URL(endPoint);
    backendOrigin = url.origin;
  } catch (e) {}

  return createStore({
    state: {
      backendOrigin,
      canEditImageSize,
      currentEntryPoint: null,
      debug,
      directory: null,
      editContent: null,
      editFilename: false,
      endPoints: {
        deleteFile: `${endPoint}/delete${debugStr}`,
        downloadArchive: `${endPoint}/download-archive${debugStr}`,
        getFileContent: `${endPoint}/get-file-content`,
        editFile: `${endPoint}/edit${debugStr}`,
        getFiles: `${endPoint}/get-files${debugStr}`,
        uploadFile: `${endPoint}/upload${debugStr}`,
        chunkFile: `${endPoint}/chunk${debugStr}`,
        addDirectory: `${endPoint}/add-directory${debugStr}`,
        cropFile: `${endPoint}/crop${debugStr}`,
      },
      entryPoints,
      files: [],
      form,
      fileUpload: completeUploadOptions(fileUpload),
      fileValidation: checkAndFixValidation(fileValidation),
      indexes,
      initialSelectionPaths: parseSelection(selection, entryPoints),
      isModal,
      multiple,
      selectedFiles: [],
      showValidationString,
      sortBy: "filename",
      secondaryDirectories: [],
      themePrefix,
    },
    getters: {
      sortedFiles(state) {
        return state.files.sort((a, b) => {
          let aType = a.type === "temp-file" ? "file" : a.type;
          let bType = b.type === "temp-file" ? "file" : b.type;

          if (aType === bType) {
            return a[state.sortBy] > b[state.sortBy];
          } else {
            return aType === "dir" ? false : true;
          }
        });
      },
      completeDirectory(state) {
        let suffixe = "",
          prefix = "";
        if (!state.currentEntryPoint) {
          return null;
        }
        if (state.secondaryDirectories.length > 0) {
          suffixe = state.secondaryDirectories.join("/");
        }
        if (state.currentEntryPoint.directory !== "") {
          prefix = state.currentEntryPoint.directory;
        }
        return prefix + (suffixe !== "" ? (prefix !== "" ? "/" : "") + suffixe : "");
      },
      invalidSelectedFiles(state) {
        return state.selectedFiles.filter((file) => {
          return !isValidFile(file, state.fileValidation);
        });
      },
      uneditableSelectedFiles(state) {
        return state.selectedFiles.filter((file) => {
          return !isEditableFile(file, state.fileValidation);
        });
      },
    },
    mutations: {
      setFiles(state, files) {
        state.files = files;
      },
      replaceFile(state, { file, newFile }) {
        let pos = state.files.indexOf(file);
        if (pos === -1) {
          console.log("impossible de trouver le fichier", file);
        }
        state.files.splice(pos, 1, newFile);
      },
      replaceFileByLiipId(state, { fileLiipId, newFile }) {
        let pos = state.files.findIndex((f) => f.liipId === fileLiipId);
        if (pos === -1) {
          console.log(
            "impossible de trouver le fichier à remplacer",
            state.files.map((f) => f.liipId).join(","),
            fileLiipId,
          );
          return;
        }
        state.files.splice(pos, 1, newFile);
      },
      updateFileUploadProgress(state, { liipId, progression }) {
        let pos = state.files.findIndex((f) => f.liipId === liipId);
        if (pos === -1) {
          console.log(
            "impossible de trouver le fichier",
            state.files.map((f) => f.liipId).join(","),
            liipId,
            progression,
          );
          return;
        }
        if (!state.files[pos].uploadInfos) {
          console.log("le fichier n'a pas d'options d'upload", state.files[pos]);
          return;
        }
        state.files[pos].uploadInfos.progression = progression;
      },
      removeFile(state, file) {
        let pos = state.files.indexOf(file);
        if (pos === -1) {
          console.log("impossible de trouver le fichier", file);
          return;
        }
        state.files.splice(pos, 1);
      },
      setDirectory(state, directory) {
        state.directory = directory;
      },
      setEntryPoints(state, entryPoints) {
        state.entryPoints = entryPoints;
      },
      addFile(state, file) {
        state.files.splice(0, 0, file);
      },
      selectFileByLiipId(state, liipId) {
        let file = state.files.find((f) => f.liipId === liipId);
        if (!file) {
          return;
        }
        state.selectedFiles = [file];
      },
      addFileByLiipIdToSelection(state, fileLiipId) {
        let file = state.files.find((f) => f.liipId === fileLiipId);
        if (!file) {
          return;
        }
        state.selectedFiles.push(file);
      },
      addFileToSelection(state, file) {
        state.selectedFiles.push(file);
      },
      removeFileToSelection(state, file) {
        let index = state.selectedFiles.indexOf(file);
        if (index !== -1) {
          state.selectedFiles.splice(index, 1);
        }
      },
      clearSelection(state) {
        state.selectedFiles = [];
      },

      setEditFilename(state, focus) {
        state.editFilename = focus;
      },
      setEditContent(state, file = null) {
        state.editContent = file;
      },

      setCurrentEntryPoint(state, entryPoint) {
        state.currentEntryPoint = entryPoint;
      },
      setSecondaryDirectory(state, arr) {
        state.secondaryDirectories = arr;
      },
      setInitialSelectionPaths(state, selectionPaths) {
        state.initialSelectionPaths = selectionPaths;
      },
    },
    actions: {
      async addDirectory({ state, getters, commit }, newDirectoryName) {
        let suffix = 0,
          filename = newDirectoryName;
        while (state.files.some((f) => f.filename === filename)) {
          suffix++;
          filename = `${newDirectoryName}-${suffix}`;
        }
        return formFetchOrNotify(state.endPoints.addDirectory, {
          body: {
            filename,
            directory: getters.completeDirectory,
            origin: state.currentEntryPoint.origin,
          },
        }).then(({ directory }) => {
          commit("addFile", directory);
        });
      },
      async cropFile({ commit, state }, { file, dimensions, finalWidth, finalHeight }) {
        let { uploadRelativePath, origin } = file;
        let { x, y, width, height, rotate } = dimensions;
        // console.log("before crop", file);
        return formFetchOrNotify(state.endPoints.cropFile, {
          body: {
            uploadRelativePath,
            origin,
            x,
            y,
            width,
            height,
            finalWidth,
            finalHeight,
            rotate,
          },
        }).then(({ file: newFile }) => {
          commit("removeFileToSelection", file);
          commit("replaceFile", { file, newFile });
          commit("addFileToSelection", newFile);
          commit("setEditContent", newFile);
          // console.log("file cropped", file);
          return newFile;
        });
      },
      async updateFile({ commit, state }, { oldLiipId, newFile }) {
        let isSelected = state.selectedFiles.some((f) => f.liipId === oldLiipId);

        if (isSelected) {
          commit("clearSelection");
        }

        commit("replaceFileByLiipId", { fileLiipId: oldLiipId, newFile });
        if (isSelected) {
          commit("selectFileByLiipId", newFile.liipId);
        }
      },
      async updateFilename({ commit, state }, { file, newFilename }) {
        let { origin, uploadRelativePath, directory, filename } = file;
        return formFetchOrNotify(state.endPoints.editFile, {
          body: {
            origin,
            uploadRelativePath,
            directory,
            filename,
            readOnly: state.currentEntryPoint.readOnly,
            newFilename,
          },
        }).then(({ file: newFile }) => {
          commit("clearSelection");
          commit("replaceFile", { file, newFile });
          commit("selectFileByLiipId", newFile.liipId);
        });
      },
      async download({ state }, { files = [] }) {
        if (files.length === 1 && files[0].type !== "dir") {
          let file = files[0];
          fetchOrNotify(
            `${state.endPoints.getFileContent}/download/${file.origin}/${file.uploadRelativePath}`,
          )
            .then((t) => t.blob())
            .then((b) => downloadFromBlob(b, file.filename));
          return;
        }

        let archiveName =
          state.directory.filename + "-" + toIsoString(new Date()) + ".zip";

        return formFetchOrNotify(state.endPoints.downloadArchive, {
          body: {
            files: files.map((f) => f.liipId),
          },
        })
          .then((t) => t.blob())
          .then((b) => {
            downloadFromBlob(b, archiveName);
          });
      },
      async deleteSelectedFiles({ commit, dispatch, state, getters }) {
        formFetchOrNotify(state.endPoints.deleteFile, {
          body: {
            files: state.selectedFiles.map((f) => f.liipId),
          },
        }).catch(() => {
          dispatch("getFiles");
        });

        let selection = state.selectedFiles;

        let nextId;

        commit("clearSelection");
        for (let file of selection) {
          let filePos = getters.sortedFiles.findIndex((f) => f.liipId === file.liipId);
          /* prettier-ignore */
          nextId = getters.sortedFiles[filePos + 1]
            ? getters.sortedFiles[filePos + 1].liipId
            : getters.sortedFiles[filePos - 1]
              ? getters.sortedFiles[filePos - 1].liipId
              : null;
          commit("removeFile", file);
        }

        if (nextId) {
          commit("addFileByLiipIdToSelection", nextId);
        }
      },
      async getFiles({ dispatch, state, getters, commit }) {
        return formFetchOrNotify(state.endPoints.getFiles, {
          body: {
            directory: getters.completeDirectory,
            origin: state.currentEntryPoint.origin,
            mimeGroup: state.fileValidation ? state.fileValidation.mimeGroup : null,
          },
        }).then(({ files, directory }) => {
          if (state.indexes) {
            dispatch("setFiles", files);
          }

          commit("setDirectory", directory);

          if (state.initialSelectionPaths) {
            for (let initialSelectionPath of state.initialSelectionPaths) {
              let file = files.find((f) => f.liipId === initialSelectionPath.liipId);
              if (file) {
                commit("addFileToSelection", file);
              }
            }
            commit("setInitialSelectionPaths", null);
          }
        });
      },
      async setFiles({ commit }, files) {
        commit("clearSelection");
        commit("setFiles", files);
      },
      async setCurrentEntryPoint({ commit, dispatch, state }, entryPoint) {
        commit("setCurrentEntryPoint", entryPoint);
        let directory = entryPoint.directory;
        if (state.initialSelectionPaths) {
          directory = state.initialSelectionPaths[0].dir;
        }
        dispatch("setSecondaryDirectoryFromFullDirectory", directory);
      },
      async setSecondaryDirectoryFromFullDirectory({ state, commit, dispatch }, path) {
        let prefix = state.currentEntryPoint.directory;
        if (path.indexOf(prefix) !== 0) {
          console.error("répertoire inconnu");
          return;
        }
        // prefix                    path                                suffix
        // "projet/alterosac/public" projet/alterosac/public/artistes/fx artistes/fx
        // "projet/alterosac/todo"   projet/alterosac/todo/artistes/fx   artistes/fx

        let suffix = path.substring(prefix.length);
        let secondaryDirectories = [];
        if (suffix !== "") {
          // si prefix est vide il n'y a pas de slash initial sinon il y en a un.
          suffix = suffix.replace(/^\//, "");
          secondaryDirectories = suffix.split("/");
        }
        commit("setSecondaryDirectory", secondaryDirectories);
        dispatch("getFiles");
        // console.log(prefix, suffix);
      },
      async init({ dispatch, state }) {
        let entryPoint;

        if (state.initialSelectionPaths) {
          entryPoint = state.entryPoints.find(
            (e) => e.origin === state.initialSelectionPaths[0].origin,
          );
        }
        if (entryPoint) {
          dispatch("setCurrentEntryPoint", entryPoint);
        } else {
          dispatch("setCurrentEntryPoint", state.entryPoints[0]);
        }
      },
      setSelectionPaths({ commit, state }, selection) {
        let initialSelectionPaths = parseSelection(selection, state.entryPoints);
        commit("setFiles", []);
        commit("setInitialSelectionPaths", initialSelectionPaths);
      },
    },
  });
}
