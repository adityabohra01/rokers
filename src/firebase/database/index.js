import firebaseApp from "../"
import { getDatabase, ref } from "firebase/database"

const db = getDatabase(firebaseApp)

export default db