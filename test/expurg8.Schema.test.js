typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8.Schema', function() {
	var UNDEF;

	suite( 'basic coercion', function() {

		test( 'no type casting', function( done ) {
			var data_raw = {
					critics_consensus   : 'Warm, whimsical, and poignant, the immaculately framed and beautifully acted Moonrise Kingdom presents writer/director Wes Anderson at his idiosyncratic best.',
					id                  : '771242131',
					mpaa_rating         : 'PG-13',
					ratings             : {
						audience_rating : 'Upright',
						audience_score  : 90,
						critics_rating  : 'Certified Fresh',
						critics_score   : 94
					},
					release_dates       : {
						dvd             : '2012-10-16',
						theater         : '2012-05-25'
					},
					runtime             : 94,
					synopsis            : 'Set on an island off the coast of New England in the summer of 1965, Moonrise Kingdom tells the story of two twelve-year-olds who fall in love, make a secret pact, and run away together into the wilderness. As various authorities try to hunt them down, a violent storm is brewing off-shore -- and the peaceful island community is turned upside down in more ways than anyone can handle. Bruce Willis plays the local sheriff. Edward Norton is a Khaki Scout troop leader. Bill Murray and Frances McDormand portray the young girl\'s parents. The cast also includes Tilda Swinton, Jason Schwartzman, and Jared Gilman and Kara Hayward as the boy and girl. -- (C) Focus Features',
					title               : 'Moonrise Kingdom',
					year                : 2012
				},
				data_clean = {
					consensus    : 'Warm, whimsical, and poignant, the immaculately framed and beautifully acted Moonrise Kingdom presents writer/director Wes Anderson at his idiosyncratic best.',
					id           : '771242131',
					mpaa         : 'PG-13',
					rating       : {
						audience : 'Upright',
						critics  : 'Certified Fresh'
					},
					runtime      : 94,
					score        : {
						audience : 90,
						critics  : 94
					},
					synopsis     : 'Set on an island off the coast of New England in the summer of 1965, Moonrise Kingdom tells the story of two twelve-year-olds who fall in love, make a secret pact, and run away together into the wilderness. As various authorities try to hunt them down, a violent storm is brewing off-shore -- and the peaceful island community is turned upside down in more ways than anyone can handle. Bruce Willis plays the local sheriff. Edward Norton is a Khaki Scout troop leader. Bill Murray and Frances McDormand portray the young girl\'s parents. The cast also includes Tilda Swinton, Jason Schwartzman, and Jared Gilman and Kara Hayward as the boy and girl. -- (C) Focus Features',
					title        : 'Moonrise Kingdom',
					year         : 2012
				},
				schema_1 = expurg8.create( 'Schema', {
					properties   : {
						id                : {
							min           : 1,
							type          : {
								fallback  : '000000000',
								max       : 9,
								min       : 9,
								pattern   : /[0-9]{9}/,
								type      : 'string'
							}
						},
						title             : {
							min           : 1,
							type          : {
								fallback  : 'NO TITLE',
								type      : 'string'
							}
						},
						year              : {
							min           : 1,
							type          : {
								fallback  : 2012,
								max       : 2013,
								min       : 2012,
								type      : 'int'
							}
						},
						mpaa              : {
							cite          : 'mpaa_rating',
							min           : 1,
							type          : {
								fallback  : 'Unrated',
								list      : ['PG', 'PG-13', 'R', 'Unrated'],
								type      : 'enum'
							}
						},
						runtime           : {
							min           : 1,
							type          : 'int'
						},
						consensus         : {
							cite          : 'critics_consensus',
							min           : 1,
							type          : 'string'
						},
						'rating.critics'  : {
							cite          : 'ratings.critics_rating',
							min           : 1,
							type          : 'string'
						},
						'rating.audience' : {
							cite          : 'ratings.audience_rating',
							min           : 1,
							type          : 'string'
						},
						'score.critics'   : {
							cite          : 'ratings.critics_score',
							min           : 1,
							type          : { max : 100, type : 'int' }
						},
						'score.audience'  : {
							cite          : 'ratings.audience_score',
							min           : 1,
							type          : { max : 100, type : 'int' }
						},
						synopsis          : {
							min           : 1,
							type          : 'string'
						}
					}
				} ),
				schema_2 = expurg8.create( 'Schema', {
					properties   : [ {
						id            : 'id',
						min           : 1,
						type          : {
							fallback  : '000000000',
							max       : 9,
							min       : 9,
							pattern   : /[0-9]{9}/,
							type      : 'string'
						}
					}, {
						id            : 'title',
						min           : 1,
						type          : {
							fallback  : 'NO TITLE',
							type      : 'string'
						}
					}, {
						id            : 'year',
						min           : 1,
						type          : {
							fallback  : 2012,
							max       : 2013,
							min       : 2012,
							type      : 'int'
						}
					}, {
						cite          : 'mpaa_rating',
						id            : 'mpaa',
						min           : 1,
						type          : {
							fallback  : 'Unrated',
							list      : ['PG', 'PG-13', 'R', 'Unrated'],
							type      : 'enum'
						}
					}, {
						id            : 'runtime',
						min           : 1,
						type          : 'int'
					}, {
						cite          : 'critics_consensus',
						id            : 'consensus',
						min           : 1,
						type          : 'string'
					}, {
						cite          : 'ratings.critics_rating',
						id            : 'rating.critics',
						min           : 1,
						type          : 'string'
					}, {
						cite          : 'ratings.audience_rating',
						id            : 'rating.audience',
						min           : 1,
						type          : 'string'
					}, {
						cite          : 'ratings.critics_score',
						id            : 'score.critics',
						min           : 1,
						type          : { max : 100, type : 'int' }
					}, {
						cite          : 'ratings.audience_score',
						id            : 'score.audience',
						min           : 1,
						type          : { max : 100, type : 'int' }
					}, {
						id            : 'synopsis',
						min           : 1,
						type          : 'string'
					} ]
				} );

			expect( schema_1.coerce( data_raw ) ).to.eql( data_clean );
			expect( schema_2.coerce( data_raw ) ).to.eql( data_clean );
			expect( data_raw ).to.not.eql( data_clean );

			done();
		} );

		test( 'casting an object to an array', function( done ) {
			var data_raw = {
					critics_consensus   : 'Warm, whimsical, and poignant, the immaculately framed and beautifully acted Moonrise Kingdom presents writer/director Wes Anderson at his idiosyncratic best.',
					id                  : '771242131',
					mpaa_rating         : 'PG-13',
					ratings             : {
						audience_rating : 'Upright',
						audience_score  : 90,
						critics_rating  : 'Certified Fresh',
						critics_score   : 94
					},
					release_dates       : {
						dvd             : '2012-10-16',
						theater         : '2012-05-25'
					},
					runtime             : 94,
					synopsis            : 'Set on an island off the coast of New England in the summer of 1965, Moonrise Kingdom tells the story of two twelve-year-olds who fall in love, make a secret pact, and run away together into the wilderness. As various authorities try to hunt them down, a violent storm is brewing off-shore -- and the peaceful island community is turned upside down in more ways than anyone can handle. Bruce Willis plays the local sheriff. Edward Norton is a Khaki Scout troop leader. Bill Murray and Frances McDormand portray the young girl\'s parents. The cast also includes Tilda Swinton, Jason Schwartzman, and Jared Gilman and Kara Hayward as the boy and girl. -- (C) Focus Features',
					title               : 'Moonrise Kingdom',
					year                : 2012
			},
			data_clean = [
				'771242131',
				'Moonrise Kingdom',
				2012,
				'PG-13',
				94,
				'Warm, whimsical, and poignant, the immaculately framed and beautifully acted Moonrise Kingdom presents writer/director Wes Anderson at his idiosyncratic best.',
				{ rating : 'Certified Fresh', score : 94 },
				{ rating : 'Upright',         score : 90 },
				'Set on an island off the coast of New England in the summer of 1965, Moonrise Kingdom tells the story of two twelve-year-olds who fall in love, make a secret pact, and run away together into the wilderness. As various authorities try to hunt them down, a violent storm is brewing off-shore -- and the peaceful island community is turned upside down in more ways than anyone can handle. Bruce Willis plays the local sheriff. Edward Norton is a Khaki Scout troop leader. Bill Murray and Frances McDormand portray the young girl\'s parents. The cast also includes Tilda Swinton, Jason Schwartzman, and Jared Gilman and Kara Hayward as the boy and girl. -- (C) Focus Features'
			],
			schema = expurg8.create( 'Schema', {
					cast         : '[]',
					properties   : [ {
						cite          : 'id',
						min           : 1,
						type          : {
							fallback  : '000000000',
							max       : 9,
							min       : 9,
							pattern   : /[0-9]{9}/,
							type      : 'string'
						}
					}, {
						cite          : 'title',
						min           : 1,
						type          : {
							fallback  : 'NO TITLE',
							type      : 'string'
						}
					}, {
						cite          : 'year',
						min           : 1,
						type          : {
							fallback  : 2012,
							max       : 2013,
							min       : 2012,
							type      : 'int'
						}
					}, {
						cite          : 'mpaa_rating',
						min           : 1,
						type          : {
							fallback  : 'Unrated',
							list      : ['PG', 'PG-13', 'R', 'Unrated'],
							type      : 'enum'
						}
					}, {
						cite          : 'runtime',
						min           : 1,
						type          : 'int'
					}, {
						cite          : 'critics_consensus',
						min           : 1,
						type          : 'string'
					}, {
						cite          : 'ratings.critics_rating',
						id            : '6.rating',
						min           : 1,
						type          : 'string'
					}, {
						cite          : 'ratings.audience_rating',
						id            : '7.rating',
						min           : 1,
						type          : 'string'
					}, {
						cite          : 'ratings.critics_score',
						id            : '6.score',
						min           : 1,
						type          : { max : 100, type : 'int' }
					}, {
						cite          : 'ratings.audience_score',
						id            : '7.score',
						min           : 1,
						type          : { max : 100, type : 'int' }
					}, {
						cite          : 'synopsis',
						id            : 8,
						min           : 1,
						type          : 'string'
					} ]
				} );

			expect( schema.coerce( data_raw ) ).to.be.a( 'array' );
			expect( schema.coerce( data_raw ) ).to.eql( data_clean );

			done();
		} );

		test( 'casting an array to an object', function( done ) {
			var data_raw = [
					'771242131',
					'Moonrise Kingdom',
					2012,
					'PG-13',
					94,
					'Warm, whimsical, and poignant, the immaculately framed and beautifully acted Moonrise Kingdom presents writer/director Wes Anderson at his idiosyncratic best.',
					{ rating : 'Certified Fresh', score : 94 },
					{ rating : 'Upright',         score : 90 },
					'Set on an island off the coast of New England in the summer of 1965, Moonrise Kingdom tells the story of two twelve-year-olds who fall in love, make a secret pact, and run away together into the wilderness. As various authorities try to hunt them down, a violent storm is brewing off-shore -- and the peaceful island community is turned upside down in more ways than anyone can handle. Bruce Willis plays the local sheriff. Edward Norton is a Khaki Scout troop leader. Bill Murray and Frances McDormand portray the young girl\'s parents. The cast also includes Tilda Swinton, Jason Schwartzman, and Jared Gilman and Kara Hayward as the boy and girl. -- (C) Focus Features'
				],
				data_clean = {
						critics_consensus   : 'Warm, whimsical, and poignant, the immaculately framed and beautifully acted Moonrise Kingdom presents writer/director Wes Anderson at his idiosyncratic best.',
						id                  : '771242131',
						mpaa                : 'PG-13',
						audience            : {
							rating          : 'Upright',
							score           : 90
						},
						critics             : {
							rating          : 'Certified Fresh',
							score           : 94
						},
						runtime             : 94,
						synopsis            : 'Set on an island off the coast of New England in the summer of 1965, Moonrise Kingdom tells the story of two twelve-year-olds who fall in love, make a secret pact, and run away together into the wilderness. As various authorities try to hunt them down, a violent storm is brewing off-shore -- and the peaceful island community is turned upside down in more ways than anyone can handle. Bruce Willis plays the local sheriff. Edward Norton is a Khaki Scout troop leader. Bill Murray and Frances McDormand portray the young girl\'s parents. The cast also includes Tilda Swinton, Jason Schwartzman, and Jared Gilman and Kara Hayward as the boy and girl. -- (C) Focus Features',
						title               : 'Moonrise Kingdom',
						year                : 2012
				},
				schema = expurg8.create( 'Schema', {
					cast         : '{}',
					properties   : [ {
						cite          : 0,
						id            : 'id',
						min           : 1,
						type          : {
							fallback  : '000000000',
							max       : 9,
							min       : 9,
							pattern   : /[0-9]{9}/,
							type      : 'string'
						}
					}, {
						cite          : 1,
						id            : 'title',
						min           : 1,
						type          : {
							fallback  : 'NO TITLE',
							type      : 'string'
						}
					}, {
						cite          : 2,
						id            : 'year',
						min           : 1,
						type          : {
							fallback  : 2012,
							max       : 2013,
							min       : 2012,
							type      : 'int'
						}
					}, {
						cite          : 3,
						id            : 'mpaa',
						min           : 1,
						type          : {
							fallback  : 'Unrated',
							list      : ['PG', 'PG-13', 'R', 'Unrated'],
							type      : 'enum'
						}
					}, {
						cite          : 4,
						id            : 'runtime',
						min           : 1,
						type          : 'int'
					}, {
						cite          : 5,
						id            : 'critics_consensus',
						min           : 1,
						type          : 'string'
					}, {
						cite          : 6,
						id            : 'critics',
						min           : 1,
						type          : 'object'
					}, {
						cite          : 7,
						id            : 'audience',
						min           : 1,
						type          : 'object'
					}, {
						cite          : 8,
						id            : 'synopsis',
						min           : 1,
						type          : 'string'
					} ]
				} );

			expect( schema.coerce( data_raw ) ).to.not.be.a( 'array' );
			expect( schema.coerce( data_raw ) ).to.be.a( 'object' );
			expect( schema.coerce( data_raw ) ).to.eql( data_clean );

			done();
		} );
	} );

	suite( 'coercion using schema inheritance, custom types and schemas as types', function() {
		expurg8.create( 'enum', {
			fallback : 'Unrated',
			id       : 'mpaa',
			list     : 'Unrated G PG PG-13 R NC-17'.split( ' ' )
		} );

		expurg8.create( 'enum', {
			fallback : 'Unrated',
			id       : 'tomatometer',
			list     : ['Unrated', 'Rotten', 'Spilled', 'Upright', 'Fresh', 'Certified Fresh']
		} );

		expurg8.create( 'int', { id : 'score', max : 100, min : 0 } );

		expurg8.create( 'int', { fallback : 60, id : 'runtime', max : 240, min : 60 } );

		expurg8.create( 'int', {
			fallback :  ( new Date() ).getFullYear(),
			id       : 'year',
			max      :  ( new Date() ).getFullYear() + 1,
			min      :  1878
		} );

		expurg8.define( 'Rating', {
			extend       : 'Schema',
			properties   : {
				rating   : { min : 1, type : 'tomatometer' },
				score    : { min : 1, type : 'score' }
			}
		} );

		expurg8.define( 'Movie', {
			extend       : 'Schema',
			properties   : {
				id       : { min  : 1, type : 'string' },
				mpaa     : { cite : 'mpaa_rating', min : 1, type : 'mpaa' },
				runtime  : { min  : 1, type : 'runtime' },
				synopsis : { min  : 1, type : 'string' },
				title    : { min  : 1, type : 'string' },
				year     : { min  : 1, type : 'year' }
			}
		} );

		expurg8.define( 'RTMovie', {
			extend       : 'Movie',
			properties   : {
				id       : {
					type : { fallback : '000000000', min : 9, pattern : /[0-9]{9,}/, type : 'string' }
				},
				audience : {
					cite : 'ratings',
					min  : 1,
					type : {
						properties : {
							rating : { cite : 'audience_rating' },
							score  : { cite : 'audience_score' }
						},
						type       : 'rating'
					}
				},
				critics  : {
					cite : 'ratings',
					min  : 1,
					type : {
						properties : {
							rating : { cite : 'critics_rating' },
							score  : { cite : 'critics_score' }
						},
						type       : 'rating'
					}
				}
			}
		} );
		// todo: add another RTMovie schema where the nested audience/critics ratings
		// todo: return an Array [rating, score] instead of an Object to test nested casting

		test( 'coercion using a Schema which inherits from expurg8.Schema and has custom types', function( done ) {
			var schema_movie = expurg8.create( 'Movie', { id : 'movie-info' } );

			expect( schema_movie.coerce( {
				critics_consensus   : 'Warm, whimsical, and poignant, the immaculately framed and beautifully acted Moonrise Kingdom presents writer/director Wes Anderson at his idiosyncratic best.',
				id                  : 'some random string which is not validated',
				mpaa_rating         : 'PG-13',
				ratings             : {
					audience_rating : 'Upright',
					audience_score  : 90,
					critics_rating  : 'Certified Fresh',
					critics_score   : 94
				},
				release_dates       : {
					dvd             : '2012-10-16',
					theater         : '2012-05-25'
				},
				runtime             : 94,
				synopsis            : 'Set on an island off the coast of New England in the summer of 1965, Moonrise Kingdom tells the story of two twelve-year-olds who fall in love, make a secret pact, and run away together into the wilderness. As various authorities try to hunt them down, a violent storm is brewing off-shore -- and the peaceful island community is turned upside down in more ways than anyone can handle. Bruce Willis plays the local sheriff. Edward Norton is a Khaki Scout troop leader. Bill Murray and Frances McDormand portray the young girl\'s parents. The cast also includes Tilda Swinton, Jason Schwartzman, and Jared Gilman and Kara Hayward as the boy and girl. -- (C) Focus Features',
				title               : 'Moonrise Kingdom',
				year                : 2012
			} ) ).to.eql( {
				id       : "some random string which is not validated",
				mpaa     : "PG-13",
				runtime  : 94,
				synopsis : "Set on an island off the coast of New England in the summer of 1965, Moonrise Kingdom tells the story of two twelve-year-olds who fall in love, make a secret pact, and run away together into the wilderness. As various authorities try to hunt them down, a violent storm is brewing off-shore -- and the peaceful island community is turned upside down in more ways than anyone can handle. Bruce Willis plays the local sheriff. Edward Norton is a Khaki Scout troop leader. Bill Murray and Frances McDormand portray the young girl's parents. The cast also includes Tilda Swinton, Jason Schwartzman, and Jared Gilman and Kara Hayward as the boy and girl. -- (C) Focus Features",
				title    : "Moonrise Kingdom",
				year     : 2012
			} );

			done();
		} );

		test( 'coercion using a Schema which inherits from a Schema with existing properties, overwrites them and adds it\'s own properties with a Schema as property types', function( done ) {
			var schema_rtmovie = expurg8.create( 'RTMovie', { id : 'rtmovie-info' } );

			expect( schema_rtmovie.coerce( {
				critics_consensus   : 'Warm, whimsical, and poignant, the immaculately framed and beautifully acted Moonrise Kingdom presents writer/director Wes Anderson at his idiosyncratic best.',
				id                  : '771242131',
				mpaa_rating         : 'PG-13',
				ratings             : {
					audience_rating : 'Upright',
					audience_score  : 90,
					critics_rating  : 'Certified Fresh',
					critics_score   : 94
				},
				release_dates       : {
					dvd             : '2012-10-16',
					theater         : '2012-05-25'
				},
				runtime             : 94,
				synopsis            : 'Set on an island off the coast of New England in the summer of 1965, Moonrise Kingdom tells the story of two twelve-year-olds who fall in love, make a secret pact, and run away together into the wilderness. As various authorities try to hunt them down, a violent storm is brewing off-shore -- and the peaceful island community is turned upside down in more ways than anyone can handle. Bruce Willis plays the local sheriff. Edward Norton is a Khaki Scout troop leader. Bill Murray and Frances McDormand portray the young girl\'s parents. The cast also includes Tilda Swinton, Jason Schwartzman, and Jared Gilman and Kara Hayward as the boy and girl. -- (C) Focus Features',
				title               : 'Moonrise Kingdom',
				year                : 2012
			} ) ).to.eql( {
				audience : {
					rating : "Upright",
					score  : 90
				},
				critics  : {
					rating : "Certified Fresh",
					score  : 94
				},
				id       : "771242131",
				mpaa     : "PG-13",
				runtime  : 94,
				synopsis : "Set on an island off the coast of New England in the summer of 1965, Moonrise Kingdom tells the story of two twelve-year-olds who fall in love, make a secret pact, and run away together into the wilderness. As various authorities try to hunt them down, a violent storm is brewing off-shore -- and the peaceful island community is turned upside down in more ways than anyone can handle. Bruce Willis plays the local sheriff. Edward Norton is a Khaki Scout troop leader. Bill Murray and Frances McDormand portray the young girl's parents. The cast also includes Tilda Swinton, Jason Schwartzman, and Jared Gilman and Kara Hayward as the boy and girl. -- (C) Focus Features",
				title    : "Moonrise Kingdom",
				year     : 2012
			} );

			done();
		} );
	} );
} );
