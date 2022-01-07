import LoadingOverlay from 'react-loading-overlay-ts'
import BounceLoader from 'react-spinners/BounceLoader'

export default function OverlayLoading({ active, children }: { active: boolean, children: React.ReactElement }) {
  return (
    <LoadingOverlay
      active={active}
      spinner={<BounceLoader color="#9ae6b4" />}
    >
      {children}
    </LoadingOverlay>
  )
}
