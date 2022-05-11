import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  searchForm = this.fb.group({
    query: null,
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params['q']) {
        this.searchForm.controls['query'].setValue(params['q']);
      }
    });
  }

  onSubmit(): void {
    this.router.navigate(['/car-list'], {
      queryParams: { q: this.searchForm.controls['query'].value },
    });
  }
}
