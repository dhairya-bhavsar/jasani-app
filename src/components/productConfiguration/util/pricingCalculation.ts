import {IAvailableTechniques, IPricing} from "../type";
import {qtyProxy} from "../../../../index";
import {replaceCurrentElementWithNewId} from "../../../helpers/helper";


export function qtyChangeHandel(technique: IAvailableTechniques) {
    const inputQty = document.getElementById('qtySelector') as HTMLInputElement;
    if (!inputQty) return;

    inputQty.addEventListener("keypress", function (evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            evt.preventDefault();
        }
    });

    inputQty.addEventListener('input', function (event) {
        let el = event.target as HTMLInputElement;
        qtyProxy["quantity"] = el.value;
        if ("0" != el.value) {
            calculatedPricing(technique);
        }
    });
    calculatedPricing(technique);
}

export function calculatedPricing(technique: IAvailableTechniques) {
    const qty = qtyProxy?.quantity || 1;
    const pricingData: IPricing = technique?.pricing?.find((data) => {
        if (+qty >= +data.min_qty && +qty <= +data.max_qty) {
            return true;
        }
        if (
            !(+qty >= +data.min_qty && +qty <= +data.max_qty) &&
            data.max_qty == ""
        ) {
            return true;
        }
    });

    getTotalCost(pricingData.price_fixed_cost, pricingData?.price_per_unit_cost);
    getTotalPrintCost();
    renderPricingHtml(pricingData.price_fixed_cost, pricingData?.price_per_unit_cost);
}

export function getTotalCost(fixedCost, pricePerUnitCost): number {
    let totalCost = 0;

    const qty = qtyProxy?.quantity || 1;
    totalCost = Number((
        +fixedCost +
        pricePerUnitCost * +qty
    ).toFixed(2));
    qtyProxy['totalCost'] = totalCost;
    return qty
}

export function getTotalPrintCost(): number {
    let totalPrintCost = 0;
    const totalCost = +qtyProxy.totalCost || 0;
    const qty = qtyProxy?.quantity || 1;
    totalPrintCost = +(totalCost / qty).toFixed(2);
    qtyProxy['totalPrintCost'] = totalPrintCost;
    return  totalPrintCost;
}

export function renderPricingHtml(fixedCost, pricePerUnitCost) {
    const newPriceHTML = `
    <div class="unit-charge">
       <div>
          <span>Setup Charge(fixed): <p class="font-bold"> AED ${fixedCost}</p></span>
          <span>Print Charge(per unit): <p class="font-bold"> AED ${pricePerUnitCost}</p></span>
        </div>
        <div class="cost-calculation">
          <span>Total Cost: <p class="font-bold"> AED ${qtyProxy?.totalCost}</p></span>
          <span>Print Cost: <p class="font-bold"> AED ${qtyProxy?.totalPrintCost}</p></span>
        </div>
    </div>
  `;
    replaceCurrentElementWithNewId('unitCharge', newPriceHTML);
}
