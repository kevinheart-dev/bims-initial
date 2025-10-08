import React from 'react'
import EvucationCenterInventory from './EvucationCenterInventory'
import Accordion from '@/Components/Accordion'
import AffectedAreas from './AffectedAreas'
import LivelihoodEvacuation from './LivelihoodEvacuation'
import FoodInventory from './FoodInventory'
import ReliefGoods from './ReliefGoods'
const InventoryEvacuation = () => {
    return (
        <div>
            <Accordion title="6. Inventory of Evacuation Centers where Families can Relocate
                or Stay During Disasters">
                <EvucationCenterInventory />
            </Accordion>
            <Accordion title="7. List of Places/Areas where affected residents can evacuate
            during times of impending or current disaster">
                <AffectedAreas />
            </Accordion>
            <Accordion title="8. List of Places/Areas where Sources of Livelihood can be evacuated">
                <LivelihoodEvacuation />
            </Accordion>
            <Accordion title="9. Inventory of Prepositioned Food and Non-food Items">
                <FoodInventory />
            </Accordion>
            <Accordion title="10. List of Designated Evacuation Centers that will serve as Distribution
            Sites for Relief Goods(Food and Non-Food Items)">
                <ReliefGoods />
            </Accordion>
        </div>
    )
}

export default InventoryEvacuation
