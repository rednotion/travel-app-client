import { Storage } from "aws-amplify";

export async function s3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;
  const stored = await Storage.vault.put(filename, file, {contentType: file.type});
  /*Stored object's key */
  return stored.key;
}

export async function s3Delete(file_key) {
	const deleted = await Storage.vault.remove(file_key)
	return deleted
}