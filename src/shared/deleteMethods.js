export const deleteGarment = (firestore, gID) => {
  return firestore.delete({ collection: 'garments', doc: gID })
    .then(() => {
      console.log("Garment deleted from database.");
    })
    .catch(error => {
      console.error("Error deleting garment from database: ", error);
    });
}

export const deleteImage = (firebase, image) => {
  // Deletes image file from storage, and image metadata from firestore 'images' collection.
  // deleteFile(storagePath, dbPath)
  console.log(image)
  return firebase.deleteFile(image.fullPath, `images/${image.id}`)
    .then(() => {
      console.log("Image deleted from storage.");
    })
    .catch(error => {
      console.error("Error deleting image from storage: ", error);
    });
}

export const deleteGarmentFromCapsule = (firestore, gID, capsuleID, capsuleGarments) => {
  const updatedGarments = capsuleGarments.filter(g => g !== gID)
  return firestore.set({
    collection: 'capsules',
    doc: capsuleID
  }, { garments: updatedGarments }, { merge: true })
    .then(() => {
      console.log("Garment deleted from capsule.");
    })
    .catch(error => {
      console.error("Error deleting garment from capsule: ", error);
    });
}

export const deleteGarmentFromAllCapsules = (firestore, gID, capsules) => {
  // Expects capsules to be pre-filtered to include only capsules
  // that include the garment to delete - can change this if needed.
  let promises = []
  capsules.forEach(c => {
    promises.push(
      deleteGarmentFromCapsule(firestore, gID, c.id, c.garments)
    )
  })

  return Promise.all(promises)
    .then(function() {
      console.log("Garment deleted from capsules.");
    })
    .catch(function(error) {
      console.error("Error deleting garment from capsules: ", error);
    });
}

export const deleteOutfitsWithGarment = (firestore, gID, outfits) => {
  let promises = []
  outfits.forEach(o => {
    if (o.garments.includes(gID)) {
      promises.push(
        firestore.delete({
          collection: 'outfits',
          doc: o.id
        })
      )
    }
  })

  return Promise.all(promises)
    .then(function() {
      console.log("Outfits all deleted.");
    })
    .catch(function(error) {
      console.error("Error deleting outfits: ", error);
    });
}
