import Accordion from '@/Components/Accordion'
import React from 'react'
import DistributionProcess from './DistributionProcess'
import TraningsInventory from './TraningsInventory'
import ResponsiveEuipInventory from './ResponsiveEuipInventory'
import BdrrmcDirectory from './BdrrmcDirectory'
import BarangayEvacuationPlan from './BarangayEvacuationPlan'
const DisasterReadiness = () => {
    return (
        <div>
            <Accordion title="11. istribution of Relief Goods to Affected Families and Individuals">
                <DistributionProcess />
            </Accordion>
            <Accordion title="12. Inventory of Tranings Attended by the Members of BDRRMC">
                <TraningsInventory />
            </Accordion>
            <Accordion title="13. Inventory of Responsive Equipment that can be be utilized during Calamities
            and Disasters">
                <ResponsiveEuipInventory />
            </Accordion>
            <Accordion title="BDRRMC Directory">
                <BdrrmcDirectory />
            </Accordion>
            <Accordion title="BARANGAY EVACUATION PLAN">
                <BarangayEvacuationPlan />
            </Accordion>
        </div>
    )
}

export default DisasterReadiness
