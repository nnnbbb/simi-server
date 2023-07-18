import { PaginationRes } from "../../common/helper/pagination-res.helper";
import { WordResDto } from "../../word/dto/create-word.dto";

export class QueryRecordDto { }



export class QueryRecordResDto extends PaginationRes(WordResDto) {

}