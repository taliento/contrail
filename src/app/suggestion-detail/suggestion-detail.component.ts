import { Component, OnInit, Input } from '@angular/core';
import { SkySession, Suggestion, Quote, QuoteLeg} from "../shared/models/";
import { SkyScannerService } from "../shared/services/sky-scanner.service";

@Component({
  selector: 'app-suggestion-detail',
  templateUrl: './suggestion-detail.component.html',
  styleUrls: ['./suggestion-detail.component.scss']
})
export class SuggestionDetailComponent implements OnInit {
  @Input() suggestion: Suggestion;
  skySession: SkySession;

  constructor(private skyScannerService: SkyScannerService) {
    this.skySession = this.skyScannerService.getCurrentSession();
  }

  ngOnInit() {
  }

  findQuote(id: number) {
    let quote: Quote = this.suggestion.Quotes.find(x => x.QuoteId === id);
    this.setCarriers(quote.OutboundLeg);
    //    this.setCarriers(quote.InboundLeg);
    quote.OutboundLeg.Origin = this.suggestion.Places.find(x => x.PlaceId === quote.OutboundLeg.OriginId);
    quote.OutboundLeg.Destination = this.suggestion.Places.find(x => x.PlaceId === quote.OutboundLeg.DestinationId);
    return quote;
  }

  setCarriers(quoteLeg: QuoteLeg) {
    quoteLeg.Carriers = [];
    let i;
    for(i = 0; i < quoteLeg.CarrierIds.length; i++){
      let j;
      for(j = 0; j < this.suggestion.Carriers.length; j++){
        if(!quoteLeg.CarrierIds[i] === this.suggestion.Carriers[j]){
          continue;
        }
        quoteLeg.Carriers.push(this.suggestion.Carriers[j]);
      }
    }
  }

}
