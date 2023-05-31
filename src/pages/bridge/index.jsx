import { Seo } from '@/common/Seo'
import { BridgeModule } from '@/modules/bridge/BridgeModule'

export default function BridgeIndexPage () {
  return (
    <main>
      <Seo />

      <BridgeModule />
    </main>
  )
}
