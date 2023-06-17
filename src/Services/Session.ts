// Packages
import {Maid} from '../../../../Packages/Maid'
import { Signal } from '../../../../Packages/Signal'
import { Timeout } from '../../../../Packages/Scheduler'

// Create our Global-Maid (this is used so we can clean-up everything prior to updating)
const GlobalMaid = new Maid()

// Store our current-script/style
const Script = (document.currentScript as HTMLScriptElement)
const IsDevelopment = (Script.src.includes("https://xpui.app.spotify.com/"))

// Store our Spicetify-Classes
const SpicetifyLoadedSignal = new Signal<() => void>()
let AllSpicetifyLoaded = false
let SpotifyPlayer = Spicetify.Player
let SpotifyFetch = Spicetify.CosmosAsync
let SpotifyShowNotification = Spicetify.showNotification
{
	const WaitForSpicetify = () => {
		// Update our variables
		SpotifyPlayer = Spicetify.Player
		SpotifyFetch = Spicetify.CosmosAsync
		SpotifyShowNotification = Spicetify.showNotification

		// Check if we have them all yet
		if (
			(SpotifyPlayer === undefined)
			|| (SpotifyFetch === undefined)
			|| (SpotifyShowNotification === undefined)
		) {
			GlobalMaid.Give(Timeout(0, WaitForSpicetify), "WaitForSpicetify")
		} else {
			// Set/Fire that we loaded
			AllSpicetifyLoaded = true
			SpicetifyLoadedSignal.Fire()
		}
	}
	
	WaitForSpicetify()
}

// Exports
export const SpicetifyLoaded = SpicetifyLoadedSignal.GetEvent()
export const IsSpicetifyLoaded = () => IsSpicetifyLoaded
export {GlobalMaid, SpotifyPlayer, SpotifyFetch, Script, IsDevelopment}